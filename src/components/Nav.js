import React from 'react';
import { Link } from 'react-router';
import Icon from './Icon';

const Nav = () =>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Icon icon="twitter" href="https://twitter.com/Peter_J_W" />
    <Icon icon="github" href="https://github.com/peter-watters" />
    <Icon icon="linkedIn" href="https://www.linkedin.com/in/peter-watters/" />
    <Icon icon="stackOverflow" href="https://stackoverflow.com/users/1365580/peadar" />
  </nav>;

export default Nav;