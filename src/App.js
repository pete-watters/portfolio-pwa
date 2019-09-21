import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Page from './components/Page';
import './App.css';
import logo from './profilepic.jpg';
import Icon from './components/Icon';
import CONFIG from './constants';


const Home = (props) =>
  <Page title="Home">
    {/* TODO create an article HOC so home is black */}
    <article>
      <img src={logo} className="profile" alt="" />
      <div>
        <h3>
         Full stack developer, UX specialist and Javascript enthusiast.
        </h3>
      <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
      <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
      <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
      <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
      </div>
    </article>
  </Page>;

const About = (props) =>
  <Page title="About"> 
      <h4>About Me</h4>
      <h5>Full stack developer, UX specialist and JavaScript enthusiast. A fully qualified engineer and hobbyist coder turned craftsman with a focus on clean scalable code and elegant but intuitive UX.</h5>

      <h4>Contact Details</h4>
      <h5>My preferred method of contact is email and you can reach me at: <a href="mailto:peter@peterjwatters.com" target="_top">peter@peterjwatters.com</a></h5>
        Or else at the social channels below: 
        <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
        <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
        <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
        <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
  </Page>;


const Blog = (props) =>
  <Page title="Blog"> 
      <p>Blog</p>
  </Page>;


const Projects = (props) =>
  <Page title="Projects"> 
    <p>Projects</p>
    <p>Bangers: Lorem imspium mdifwmciwmcwi</p>
    <span>Monoton: Lorem imspium mdifwmciwmcwi</span>
    <h1>Press Start 2P: Lorem imspium mdifwmciwmcwi</h1>
    <h2>Roboto Mono: Lorem imspium mdifwmciwmcwi</h2>
    <h3>Anton: Lorem imspium mdifwmciwmcwi</h3>
    <h4>Permanent Marker: Lorem imspium mdifwmciwmcwi</h4>
    <h5>Orbitron: Lorem imspium mdifwmciwmcwi</h5>
  </Page>;

class App extends Component {
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
