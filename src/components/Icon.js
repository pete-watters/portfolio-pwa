import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faStackOverflow, faGithub } from '@fortawesome/free-brands-svg-icons';

const ICON_TYPES = {
  twitter: faTwitter, 
  linkedIn: faLinkedin, 
  stackOverflow: faStackOverflow, 
  github: faGithub,
}
const Icon = ({ icon }) =>
  <FontAwesomeIcon color="#FFFFFF" icon={ICON_TYPES[icon]} />;

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Icon;