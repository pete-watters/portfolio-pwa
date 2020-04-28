import React from 'react';
import { NavLink } from 'react-router-dom';
import CONFIG from '../constants';
import SocialMedia from './SocialMedia';

const Nav = () =>
  <nav>
    <NavLink to={CONFIG.ROUTES.ABOUT}>About</NavLink>
    <NavLink to={CONFIG.ROUTES.BLOG}>Blog</NavLink>
    <SocialMedia />
  </nav>;

export default Nav;
