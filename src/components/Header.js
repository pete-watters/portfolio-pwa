import React from 'react';
import { NavLink } from 'react-router-dom';
import Nav from './Nav';
import CONFIG from '../constants';
// TODO fix this to highlight when on /
const Header = () =>
  <header>
    <h1><NavLink to={CONFIG.ROUTES.HOME}>Peter Watters</NavLink></h1>
    <Nav />
  </header>;

export default Header;