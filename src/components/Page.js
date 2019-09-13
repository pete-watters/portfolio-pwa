import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import Section from './Section';

const Page = ({ title, children }) =>
    <>
    <BrowserRouter>
      <Header />
    </BrowserRouter>
    <Section title={title}>
        <h2>{title}</h2>
        {children}
    </Section>
    </>;

Page.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Page;