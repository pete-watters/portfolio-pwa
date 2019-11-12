import React, { memo } from 'react';
import Link from '../Link';

const Work = () =>
  <article>
    <div>
        <p>If you'd like to see some of my work you can find examples at my consultancy company website <Link href="http://cteic.ie" text="C-Teic" /></p>
        <p>It's a lightweight <Link href="https://developers.google.com/web/progressive-web-apps" text="PWA" /> built using semantic HTML, simple CSS and a bit of <Link href="https://reactjs.org/" text="React" />to tie things together</p>
        <figure>
          <img src="img/work/lighthouse.jpg"  alt=""/>
          <figcaption><p>The proof is in the lighthouse score</p></figcaption>
        </figure>
        <p>The site is open source and the code is available to view on <Link href="https://github.com/pete-watters/portfolio-pwa" text="GitHub" /> </p>
    </div>
  </article>;

export default memo(Work);