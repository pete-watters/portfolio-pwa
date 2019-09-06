import React from 'react';
import PropTypes from 'prop-types';
import logo from '../profilepic.jpg';
import Nav from './Nav';
import Icon from './Icon';

const Header = ({title}) =>
  <header>
  <Nav />
  <img src={logo} className="logo" alt="" />
  <h2>{title}</h2>
      <div>
          <h1>Peter Watters</h1>
          <h3>
            <span>Full stack developer</span>, <span>UX specialist</span> and <span> Javascript enthusiast</span>.
          </h3>
          <ul>
            <li>
              <a href="https://twitter.com/Peter_J_W" target="_blank" rel="noopener noreferrer">
              <Icon icon="twitter" />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/peter-watters/" target="_blank" rel="noopener noreferrer">
              <Icon icon="linkedIn" />
              </a>
            </li>
            <li>
              <a href="https://github.com/peter-watters" target="_blank" rel="noopener noreferrer">
              <Icon icon="github" />
              </a>
            </li>
            <li>
              <a href="https://stackoverflow.com/users/1365580/peadar" target="_blank" rel="noopener noreferrer">
                <Icon icon="stackOverflow" />
              </a>
              </li>
          </ul>
    </div>
  </header>;

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;