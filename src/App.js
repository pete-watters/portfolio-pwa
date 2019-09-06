import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faStackOverflow, faGithub } from '@fortawesome/free-brands-svg-icons';
import logo from './profilepic.jpg';
import './App.css';

const Page = ({ title }) => (
    <main className="App">
      <header>
        <img src={logo} className="logo" alt="" />
        <h2>{title}</h2>
            <div>
                <h1>Peter Watters</h1>
                <h3>
                  <span>Full stack developer</span>, <span>UX specialist</span> and <span> Javascript enthusiast</span>.
                </h3>
                <ul>
                  <li>
                    <a href="https://twitter.com/Peter_J_W" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon color="#FFFFFF" icon={faTwitter} />
                    <FontAwesomeIcon color="#FFFFFF" icon="Twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/peter-watters/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon  color="#FFFFFF" icon={faLinkedin} />
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/peter-watters" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon color="#FFFFFF" icon={faGithub} />
                    </a>
                  </li>
                  <li>
                    <a href="https://stackoverflow.com/users/1365580/peadar" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon  color="#FFFFFF" icon={faStackOverflow} />
                    </a>
                    </li>
                </ul>
          </div>
      </header>
      <section>
        <p className="App-intro">
          This is the {title} page.
          <code>Billy</code>
        </p>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </section>
    </main>
);

const Home = (props) => (
  <Page title="Home"/>
);

const About = (props) => (
  <Page title="About"> 
      <p>All about me</p>
  </Page>
);

const Settings = (props) => (
  <Page title="Settings"/>
);

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
      </Router>
    );
  }
}

export default App;
