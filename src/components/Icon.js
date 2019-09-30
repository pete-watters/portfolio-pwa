import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

const ICON_TYPES = {
  twitter: faTwitter, 
  linkedIn: faLinkedin, 
  stackOverflow: faStackOverflow, 
  github: faGithub,
  medium: faMedium,
}
const Icon = ({ icon, href }) =>
  <a href={href}target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={ICON_TYPES[icon]} />
  </a>;

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default Icon;