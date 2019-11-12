import React, { memo } from 'react';
import logo from '../profilepic.jpg';
import Page from '../components/Page';
import SocialMedia from '../components/SocialMedia';
import Link from '../components/Link';

const Home = () =>
  <Page>
      <img src={logo} className="profile" alt="" />
      <p>Full stack developer, UX specialist and JavaScript enthusiast.</p>
      <p>Academically qualified engineer and hobbyist coder turned craftsman.</p>
      <p>I specialise in well tested, clean scalable code with an elegant and intuitive UX.</p>
      <p>Available for hire as a software developer, coach and speaker.</p>
      <p>Reach me at: <Link href="mailto:pete@cteic.ie" text="pete@cteic.ie" /></p>
      <footer>
      <SocialMedia />
      </footer>
  </Page>;
  
export default memo(Home);