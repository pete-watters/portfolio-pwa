import React, { memo } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import { About, Blog, Home } from './pages';
import './App.css';
import CONFIG from './constants';
const App = () => 
      <Router>
        <Header />
        <main>
          <Route exact path={CONFIG.ROUTES.HOME} component={Home}/>
          <Route exact path={CONFIG.ROUTES.ABOUT} component={About}/>
          <Route exact path={CONFIG.ROUTES.BLOG} component={Blog}/>
{/* TODO first blog post is about using semantic HTML for typography and CSS style 
        <p>Projects</p>
        <p>Bangers: Lorem imspium mdifwmciwmcwi</p>
        <span>Monoton: Lorem imspium mdifwmciwmcwi</span>
        <h1>Press Start 2P: Lorem imspium mdifwmciwmcwi</h1>
        <h2>Roboto Mono: Lorem imspium mdifwmciwmcwi</h2>
        <h3>Anton: Lorem imspium mdifwmciwmcwi</h3>
        <h4>Permanent Marker: Lorem imspium mdifwmciwmcwi</h4>
        <h5>Orbitron: Lorem imspium mdifwmciwmcwi</h5> */}
        </main>
      </Router>;

export default memo(App);
