import React from 'react';
import Page from 'components/Page';
import SocialMedia from 'components/SocialMedia';
import Link from 'components/Link';

const Home = () =>
  <Page>
    <p>Full stack developer, UX specialist and JavaScript enthusiast.</p>
    <p>Reach me at: <Link href="mailto:pete@cteic.ie" text="pete@cteic.ie" /></p>
    <footer>
      <SocialMedia />
    </footer>
  </Page>;

export default Home;
