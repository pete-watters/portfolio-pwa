import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import CONFIG from '../constants';

const Nav = () =>
    <nav>
      <NavLink to={CONFIG.ROUTES.ABOUT}>About</NavLink>
      <NavLink to={CONFIG.ROUTES.BLOG}>Blog</NavLink>
      <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
      <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
      <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
      <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
      <Icon icon="medium" href={CONFIG.SOCIAL.MEDIUM} />
      <Icon icon="instagram" href={CONFIG.SOCIAL.INSTAGRAM} />
    </nav>;

export default Nav;