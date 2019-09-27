import React from 'react';
import logo from '../profilepic.jpg';
import CONFIG from '../constants';
import Icon from '../components/Icon';
import Page from '../components/Page';

export const Home = () =>
  <Page>
      <img src={logo} className="profile" alt="" />
      <p>Full stack developer, UX specialist and JavaScript enthusiast.</p>
      <p>A hobbyist coder turned craftsman with a focus on clean scalable code and elegant but intuitive UX.</p>
      <p>My preferred method of contact is email and you can reach me at: <a href="mailto:peter@peterjwatters.com" target="_top">peter@peterjwatters.com</a></p>
      <p>Or else at the social channels below:</p>
      <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
      <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
      <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
      <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
  </Page>;