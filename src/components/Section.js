import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Section = ({children}) =>
  <section>
    {children}
  </section>;

Section.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(Section);