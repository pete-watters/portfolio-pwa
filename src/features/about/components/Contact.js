import React, { memo } from 'react';
import SocialMedia from '../SocialMedia';
import Link from '../Link';

const Contact = () =>
  <article>
    <div>
        <p>Reach me at: <Link href="mailto:pete@cteic.ie" text="pete@cteic.ie" /></p>
        <SocialMedia />
    </div>
  </article>;

export default memo(Contact);