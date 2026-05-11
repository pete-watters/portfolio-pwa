---
title: "Building a Server-Rendered Email Verification Flow at Xapo"
description: "How we orchestrated a conditional API fetch on the Express side, server-rendered the result into a Next.js 9 page, and avoided the loading flash on email-link landings — and why the same instinct points to Server Components today."
pubDate: 2019-09-01
tags: ["nextjs", "ssr", "architecture", "xapo"]
draft: false
---

When you click a verification link from an email, you've already committed to an outcome. The link is either valid, expired, already-used, or broken. You don't want to see a spinner — you want the result.

In 2018, at Xapo, I was building a standalone web app. One of its jobs was to handle email confirmations for identity certificates: the kind of one-shot landings users hit exactly once, from an email client, often on mobile, often on a flaky connection. A loading flash on a page like that feels wrong. The link promised a result. The page should deliver one on first paint.

This is the story of how I built that flow with Next.js 9 and a custom Express server — and how I'd build it today.

## The constraint

Xapo's main product was a mobile crypto wallet. The app handled most of what users needed. But certain flows — identity verification, account freezing, password recovery — couldn't live inside it. They were triggered by email links, often opened on a different device than the one with the app installed. They needed standalone web endpoints.

That meant a separate frontend application. Lightweight, single-purpose, and able to do real work the moment the page loaded.

## Why a custom server

Next.js 9 had landed earlier that year. It was a good fit for most of what we needed: SSR out of the box, file-based routing, a sensible build pipeline. But the verify flow had a wrinkle. Before the page could render, the server needed to:

1. Take an `identityCertId` and `secret` from the URL.
2. Call our internal identity API to check the certificate's current state.
3. Depending on that state, conditionally call a second Verify service.
4. Set an HTTP status code that matched the result.
5. Render the page with the resolved data already in props.

In Next.js 9, `getInitialProps` ran on both server and client, and it didn't give you the Express response object — you couldn't set status codes from there, and you didn't want to do conditional multi-step API orchestration inside it either. The idiomatic answer was a custom server. So I wrote one.

```js
import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import { app } from './init';
import CONFIG from './config';
import ROUTES from './routes';

const requestHandler = app.getRequestHandler();
const server = express();

(async () => {
  await app.prepare();
  server.use(bodyParser.json());
  server.use(CONFIG.ROUTES.FREEZE, ROUTES.FREEZE);
  server.use(CONFIG.ROUTES.HEALTH, ROUTES.HEALTH);
  server.use(CONFIG.ROUTES.VERIFY, ROUTES.VERIFY);
  server.get(CONFIG.ROUTES.ALL, (req, res) => requestHandler(req, res));

  await https.createServer({
    key: CONFIG.KEY.SERVER,
    cert: CONFIG.CRT.SERVER,
  }, server).listen(CONFIG.PORT);
})();
```

That's the whole bootstrap. Express in front, Next.js's request handler as the catch-all, a few named routes that took priority. HTTPS terminated in-process; the container handled TLS itself, certs loaded from config.

## The verify route

This is where it gets interesting. The customer's email contained a link like `/verify/:identityCertId/:secret`. Express handled it before Next.js saw it.

```js
router.get('/:identityCertId/:secret', async (req, res) => {
  const { params } = req;
  const { identityCertId } = params;

  try {
    const { state: idCertState, value: emailAddress } = await Check(identityCertId);
    const certInfo = { ...params, email: emailAddress, idCertState };

    if (verifiedCertificate(idCertState)) {
      app.render(req, res, CONFIG.ROUTES.VERIFY, certInfo);
    } else if (isValidCertificate(idCertState)) {
      const verificationSuccess = await verifyCertificate(req, res, params);
      app.render(req, res, CONFIG.ROUTES.VERIFY, { ...certInfo, error: !verificationSuccess });
    } else {
      res.status(CONFIG.HTTP.SERVER_ERROR);
      app.render(req, res, CONFIG.ROUTES.VERIFY, { ...certInfo, error: true });
    }
  } catch (error) {
    res.status(CONFIG.HTTP.SERVER_ERROR);
    app.render(req, res, CONFIG.ROUTES.ERROR, { error: true });
  }
});
```

Three branches.

The cert is already verified. Render the success page with the user's email, no second API call. Idempotent — the user clicked the link twice, no problem.

The cert is pending. Call the Verify service. If it succeeds, render success; if it fails, render error. Either way, render fully populated.

The cert is in any other state — expired, revoked, unknown. Set a 500, render the error page with context.

The thing tying all three together is `app.render(req, res, '/verify', data)`. Next.js exposes this method on the prepared app instance: server-render a page route with arbitrary props, then write the HTML response. The page itself just consumes the data:

```jsx
const Verify = ({ error, email }) =>
  <>
    {error && <Error email={email} />}
    {!error && <Success email={email} />}
  </>;

Verify.getInitialProps = ({ query }) => query;
```

`getInitialProps` reads the props passed to `app.render`. The page doesn't know it was rendered by an Express route with two upstream API calls behind it. It just sees `email` and `error` in its query bag and renders the right component.

## Why this was the right shape

Three things mattered.

**Secrets stayed server-side.** The internal API base URL, the auth credentials, the verify service endpoint — none of it touched the browser. The client only ever received rendered HTML and a resolved boolean. Doing the verify call from the client, even with a same-origin proxy, would have meant another round trip and would have put the secret in a place I didn't want to manage.

**Status codes were honest.** Monitoring at Xapo cared about HTTP status. If a cert was in a bad state, the route returned 500. If the verify succeeded, it returned 200. The existing dashboards could see verification failures without anyone wiring up custom telemetry — the infrastructure already understood HTTP. This sounds small. It wasn't.

**No loading flash.** When the user opened the email and tapped the link, the response arrived already resolved. No skeleton, no spinner, no client-side fetch firing on mount, no race between data arriving and UI mounting. The page rendered with `email="user@example.com"` already in its props on first paint. For an email-link landing, that's the difference between feeling like an app and feeling like a confirmation.

## What it became

This wasn't a one-off. The pattern — custom Express server, Next.js as the catch-all, named routes for server-side data fetching, `app.render` to hand off to a page — turned out to fit several other lightweight web apps at Xapo. Account freeze flows, password recovery, internal support tooling: the small standalone things that lived outside the mobile app and needed real server-side logic.

It also became the skeleton for a much larger project: the rewrite of Xapo's legacy banking-style web application. Same architecture, same custom server pattern, much bigger feature surface.

I'd joined as a senior engineer without prior React experience. Within the first year, the application framework I'd put together for this app was the one the rest of the frontend org forked from. The team grew from a pair to eight engineers over that period, and I wasn't the one telling people what to use — they picked it up because it fit. That was satisfying in a quiet way. Nothing about the code was groundbreaking. It just matched the problem.

## Would I build it the same way today?

No. And the reason is the more interesting part.

The instinct in 2019 was: I have data the server can resolve before render, I want the page to come back fully populated with that data on first paint, and I want HTTP status codes that reflect what I found. In Next.js 9, the idiomatic way to do that was a custom Express server.

Look at what happened next:

- **Next.js 9.3** (March 2020): `getServerSideProps` landed. Per-page server-side data fetching with access to the response object. That alone would have replaced most of the reason for my custom server.
- **Next.js 13** (October 2022): App Router beta, React Server Components. Components could be async and fetch data inline, streamed into the page.
- **Next.js 13.4** (May 2023): App Router stable.
- **Next.js 15 and the current 16**: async Server Components awaiting `fetch` directly, Server Actions replacing most ad-hoc API routes, Turbopack as the default builder, the React Compiler stable, Cache Components for finer-grained data caching.

Today, the verify route is a Server Component. The page would `await Check(identityCertId)`, conditionally `await Verify(...)`, and render the right branch — all inside the component, all on the server, all in one file. A thrown error or a `notFound()` would handle the status code behaviour I used to wire up manually. No Express, no `app.render`, no `getInitialProps`.

The point isn't "look how outdated that code was." It's the opposite. The instinct that reached for a custom server in 2019 — keep secrets server-side, resolve state before render, don't show a spinner on a link landing — is the same one that reaches for Server Components in 2026. The framework absorbed the use case. What was a custom-server pattern became a built-in primitive.

That's a good outcome. The pattern was right; the framework grew into it.

## What travels

The part of this work that holds up isn't the Express server. It's the read on the problem. Email-link landings shouldn't flash. Secrets shouldn't ship to the browser. Status codes are free monitoring if you respect them. Conditional data resolution belongs upstream of render, not after it.

Those are durable. The implementation is dated, and that's fine — implementations are supposed to date. The architectures that age well are the ones whose constraints survive the framework churn around them.
