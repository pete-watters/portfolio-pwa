import React from 'react';
import { NavLink } from 'react-router-dom';
import CONFIG from '../constants';

const Nav = () =>
    <nav>
      <NavLink to={CONFIG.ROUTES.ABOUT}>About</NavLink>
      <NavLink to={CONFIG.ROUTES.BLOG}>Blog</NavLink>
      <NavLink to={CONFIG.ROUTES.PROJECTS}>Projects</NavLink>
    </nav>;

export default Nav;