import React, { memo } from 'react';
import CONFIG from '../../constants';
import Icon from '../../components/Icon';

const Contact = () =>
  <article>
    <div>
        <p>If you'd like to see some of my Contact you can find examples at my consultancy company website -<a href="https://cteic.ie" target="_blank" rel="noopener noreferrer">C-Teic</a></p>
        <p>Reach me at:<a href="mailto:pete@cteic.ie" target="_top">pete@cteic.ie</a></p>
        <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
        <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
        <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
        <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
    </div>
  </article>;

export default memo(Contact);