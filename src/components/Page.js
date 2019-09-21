import React from 'react';
import PropTypes from 'prop-types';
import Section from './Section';

const Page = ({ title, children }) =>
    <Section title={title}>
        <h2>{title}</h2>
        {children}
    </Section>;

Page.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Page;