import React, { memo } from 'react';
import SocialMedia from '../SocialMedia';
import Link from '../Link';

const Contact = () =>
  <article>
    <div>
        <p>
          If you'd like to see some of my work you can find examples at my consultancy companys website<Link href="http://cteic.ie" text="C-Teic" />.
        </p>
        <p>Reach me at: <Link href="mailto:pete@cteic.ie" text="pete@cteic.ie" /></p>
        <SocialMedia />
    </div>
  </article>;

export default memo(Contact);