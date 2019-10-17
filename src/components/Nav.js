import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import SocialMedia from './SocialMedia';
import CONFIG from '../constants';

const Nav = () =>
    <nav>
      <NavLink to={CONFIG.ROUTES.ABOUT}>About</NavLink>
      <NavLink to={CONFIG.ROUTES.BLOG}>Blog</NavLink>
      <SocialMedia />
    </nav>;

export default memo(Nav);