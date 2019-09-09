import React from 'react';
import logo from '../profilepic.jpg';
import Nav from './Nav';

const Header = ({title}) =>
  <header>
    <img src={logo} className="logo" alt="" />
    <h1>Peter Watters</h1>
    <Nav />
  </header>;

export default Header;