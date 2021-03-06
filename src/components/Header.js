import React from 'react';
import { NavLink } from 'react-router-dom';
import CONFIG from '../constants';

const Header = () =>
  <header>
    <h1><NavLink to={CONFIG.ROUTES.HOME}>Pete Watters</NavLink></h1>
  </header>;

export default Header;
