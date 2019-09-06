import React from 'react';
import PropTypes from 'prop-types';
import Main from './Main';

const Page = ({ title }) =>
    <Main title={title}>
      <section>
        <p className="App-intro">
          This is the {title} page.
          <code>Billy</code>
        </p>
      </section>
    </Main>;

Page.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Page;