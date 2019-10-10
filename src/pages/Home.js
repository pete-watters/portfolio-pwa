import React, { memo } from 'react';
import logo from '../profilepic.jpg';
import CONFIG from '../constants';
import Icon from '../components/Icon';
import Page from '../components/Page';

const Home = () =>
  <Page>
      <img src={logo} className="profile" alt="" />
      <p>Full stack developer, UX specialist and JavaScript enthusiast.</p>
      <p>A qualified engineer and hobbyist coder turned craftsman.</p>
      <p> Specialist in clean scalable code with elegant and intuitive UX.</p>
      <p>Reach me at:<a href="mailto:pete@cteic.ie" target="_top" aria-label="MailTo">pete@cteic.ie</a></p>
      <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
      <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
      <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
      <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
  </Page>;
  
export default memo(Home);