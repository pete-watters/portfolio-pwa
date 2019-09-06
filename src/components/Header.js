import React from 'react';
import PropTypes from 'prop-types';
import logo from '../profilepic.jpg';
import Nav from './Nav';

const Header = ({title}) =>
  <header>
  <img src={logo} className="logo" alt="" />
  <Nav />
  <h2>{title}</h2>
      <div>
          <h1>Peter Watters</h1>
          <h3>
            <span>Full stack developer</span>, <span>UX specialist</span> and <span> Javascript enthusiast</span>.
          </h3>
    </div>
  </header>;

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;