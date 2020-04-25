import React from 'react';
import { NavLink } from 'react-router-dom';
import CONFIG from 'constants/';
import Nav from './Nav';

const Header = () =>
  <header>
    <h1><NavLink to={CONFIG.ROUTES.HOME}>Pete Watters</NavLink></h1>
    <Nav />
  </header>;

export default Header;