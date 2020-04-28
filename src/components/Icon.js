import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faStackOverflow, faGithub, faMedium, faInstagram } from '@fortawesome/free-brands-svg-icons';

const ICON_TYPES = {
  twitter: faTwitter,
  linkedIn: faLinkedin,
  stackOverflow: faStackOverflow,
  github: faGithub,
  medium: faMedium,
  instagram: faInstagram,
};

const capitalizeTitle = iconTitle =>
  iconTitle[0].toUpperCase() + iconTitle.slice(1);

const Icon = ({ icon, href, onClick }) =>
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={icon} onClick={onClick} title={capitalizeTitle(icon)}>
    <FontAwesomeIcon icon={ICON_TYPES[icon]} />
  </a>;

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  onClick: null,
};

export default memo(Icon);
