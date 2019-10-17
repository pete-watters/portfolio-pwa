import React, { memo } from 'react';
import logo from '../profilepic.jpg';
import Page from '../components/Page';
import SocialMedia from '../components/SocialMedia';

const Home = () =>
  <Page>
      <img src={logo} className="profile" alt="" />
      <p>Full stack developer, UX specialist and JavaScript enthusiast.</p>
      <p>A qualified engineer and hobbyist coder turned craftsman.</p>
      <p>Specialist in well tested, clean scalable code with elegant and intuitive UX.</p>
      <p>Available for hire as a software developer, coach and speaker.</p>
      <p>reach me at:<a href="mailto:pete@cteic.ie" target="_top" aria-label="MailTo">pete@cteic.ie</a></p>
      <SocialMedia />
  </Page>;
  
export default memo(Home);