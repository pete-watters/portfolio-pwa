import React, { memo } from 'react';
import Link from 'components/Link';

const Work = () =>
  <article>
    <div>
      <p>This website is a lightweight <Link href="https://developers.google.com/web/progressive-web-apps" text="PWA" /> built using semantic HTML, simple CSS and a bit of <Link href="https://reactjs.org/" text="React" /> to tie things together</p>
      <figure>
        <figcaption><p>The proof is in the lighthouse score</p></figcaption>
        <img src="img/work/lighthouse.jpg" alt="Lighthouse score - 100%" />
      </figure>
      <p>The code is open source and the code is available to view on <Link href="https://github.com/pete-watters/portfolio-pwa" text="GitHub" /> </p>
    </div>
  </article>;

export default memo(Work);
