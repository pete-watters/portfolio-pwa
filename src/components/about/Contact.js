import React, { memo } from 'react';
import SocialMedia from '../SocialMedia';

const Contact = () =>
  <article>
    <div>
        <p>If you'd like to see some of my Contact you can find examples at my consultancy company website -<a href="http://cteic.ie" target="_blank" rel="noopener noreferrer">C-Teic</a></p>
        <p>Reach me at:<a href="mailto:pete@cteic.ie" target="_top">pete@cteic.ie</a></p>
        <SocialMedia />
    </div>
  </article>;

export default memo(Contact);