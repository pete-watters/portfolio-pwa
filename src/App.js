import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import { About, Blog, Home, Projects } from './pages';
import './App.css';
import CONFIG from './constants';

class App extends PureComponent {
  render() {
    return (
      <Router history={browserHistory}>
        <Header />
        <main>
          <Route exact path={CONFIG.ROUTES.HOME} component={Home}/>
          <Route exact path={CONFIG.ROUTES.ABOUT} component={About}/>
          <Route exact path={CONFIG.ROUTES.BLOG} component={Blog}/>
          <Route exact path={CONFIG.ROUTES.PROJECTS} component={Projects}/>
        </main>
      </Router>
    );
  }
}

export default App;
