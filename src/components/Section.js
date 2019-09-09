import React from 'react';
import PropTypes from 'prop-types';

const Section = ({title}) =>
  <section>
    <h2>{title}</h2>
      <div>
          <h3>
            <span>Full stack developer</span>, <span>UX specialist</span> and <span> Javascript enthusiast</span>.
          </h3>
    </div>
    <p>Bangers: Lorem imspium mdifwmciwmcwi</p>
    <span>Monoton: Lorem imspium mdifwmciwmcwi</span>
    <h1>Press Start 2P: Lorem imspium mdifwmciwmcwi</h1>
    <h2>Roboto Mono: Lorem imspium mdifwmciwmcwi</h2>
    <h3>Anton: Lorem imspium mdifwmciwmcwi</h3>
    <h4>Permanent Marker: Lorem imspium mdifwmciwmcwi</h4>
    <h5>Orbitron: Lorem imspium mdifwmciwmcwi</h5>
  </section>;

Section.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Section;