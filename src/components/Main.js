import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Section from './Section';

const Main = ({ title }) =>
  <main>
    <Header />
    <Section title={title} />
  </main>;

Main.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Main;