import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Link = ({href, text}) =>
    <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>;

Link.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

    
export default memo(Link);