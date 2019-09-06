import React, { Component } from 'react';
import { Router, browserHistory, Route } from 'react-router';
import Page from './components/Page';
import './App.css';


const Home = (props) =>
  <Page title="Home"/>;

const About = (props) =>
  <Page title="About"> 
      <p>All about me</p>
  </Page>;

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Router>
    );
  }
}

export default App;
