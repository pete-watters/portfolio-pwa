import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CONFIG from './constants';
import Header from './components/Header';
import { Home } from './features';

const App = () =>
  <Router>
    <Header />
    <main>
      <Route exact path={CONFIG.ROUTES.HOME} component={Home} />
    </main>
  </Router>;

export default App;
