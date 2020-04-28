import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CONFIG from './constants';
import Header from './components/Header';
import { About, Blog, Home } from './features';

const App = () =>
  <Router>
    <Header />
    <main>
      <Route exact path={CONFIG.ROUTES.HOME} component={Home} />
      <Route exact path={CONFIG.ROUTES.ABOUT} component={About} />
      <Route exact path={CONFIG.ROUTES.BLOG} component={Blog} />
    </main>
  </Router>;

export default App;
