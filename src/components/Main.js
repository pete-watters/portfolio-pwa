import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

const Main = ({ children, title }) =>
  <main className="App">
    <Header title={title} />
    <div>
      <p>Bangers: Lorem imspium mdifwmciwmcwi</p>
      <span>Monoton: Lorem imspium mdifwmciwmcwi</span>
      <h1>Press Start 2P: Lorem imspium mdifwmciwmcwi</h1>
      <h2>Roboto Mono: Lorem imspium mdifwmciwmcwi</h2>
      <h3>Anton: Lorem imspium mdifwmciwmcwi</h3>
      <h4>Permanent Marker: Lorem imspium mdifwmciwmcwi</h4>
      <h5>Orbitron: Lorem imspium mdifwmciwmcwi</h5>
    </div>
    {children}
  </main>;

Main.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Main;