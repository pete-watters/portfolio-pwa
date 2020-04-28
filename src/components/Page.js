import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Section from './Section';

const Page = ({ children }) =>
  <Section>
    <article>
      {children}
    </article>
  </Section>;

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(Page);
