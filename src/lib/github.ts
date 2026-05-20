// Build-time fetch of GitHub contribution data for the Open Source section.
// Requires a GITHUB_TOKEN env var (any token with default read scopes is enough
// to read a public user's contributions). Degrades gracefully to `available:
// false` when the token is missing or the request fails — the section then
// hides itself rather than rendering an empty shell.

export interface ContribDay {
  date: string;
  count: number;
  level: number; // 0–4
}

export interface GitHubStats {
  available: boolean;
  totalContributions: number;
  pullRequests: number;
  reviews: number;
  commits: number;
  currentStreak: number;
  weeks: ContribDay[][];
}

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }
`;

const EMPTY: GitHubStats = {
  available: false,
  totalContributions: 0,
  pullRequests: 0,
  reviews: 0,
  commits: 0,
  currentStreak: 0,
  weeks: [],
};

function currentStreak(weeks: ContribDay[][]): number {
  const days = weeks.flat().sort((a, b) => a.date.localeCompare(b.date));
  let i = days.length - 1;
  // Skip trailing empty days (e.g. today before the first commit) so they
  // don't read as a broken streak.
  while (i >= 0 && days[i].count === 0) i--;
  let streak = 0;
  while (i >= 0 && days[i].count > 0) {
    streak++;
    i--;
  }
  return streak;
}

export async function getGitHubStats(login: string): Promise<GitHubStats> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] GITHUB_TOKEN not set — hiding Open Source section');
    return EMPTY;
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
    });

    if (!res.ok) {
      console.warn(`[github] GraphQL ${res.status} ${res.statusText} — hiding section`);
      return EMPTY;
    }

    const json = await res.json();
    const c = json?.data?.user?.contributionsCollection;
    if (!c) return EMPTY;

    const weeks: ContribDay[][] = c.contributionCalendar.weeks.map(
      (w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVELS[d.contributionLevel] ?? 0,
        })),
    );

    return {
      available: true,
      totalContributions: c.contributionCalendar.totalContributions,
      pullRequests: c.totalPullRequestContributions,
      reviews: c.totalPullRequestReviewContributions,
      commits: c.totalCommitContributions,
      currentStreak: currentStreak(weeks),
      weeks,
    };
  } catch (err) {
    console.warn('[github] contribution fetch failed — hiding section', err);
    return EMPTY;
  }
}
