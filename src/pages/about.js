import React, { PureComponent } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Page from '../components/Page';
import { Adventures, Contact, Story, Work } from '../components/about';

const VIEWS = {
    ADVENTURES: 'Adventures',
    CONTACT: 'Contact',
    STORY: 'Story',
    WORK: 'Work'
}

const getAboutComponent = view => {
    switch(view) {
    case VIEWS.ADVENTURES:
        return <Adventures />;
    case VIEWS.CONTACT:
        return <Contact />;
    case VIEWS.STORY:
    default:
        return <Story />;
    case VIEWS.WORK:
        return <Work />;
    }
  };

class About extends PureComponent {
  constructor (props) {
      super(props);
      this.state = {
          view: null,
      };

      this.switchView = this.switchView.bind(this);
  }

  switchView(view) {
    this.setState({ view: view });
  }
  render(){      
    return (
    <Page> 
    <nav>
        <h4 onClick={() => this.switchView(VIEWS.STORY)}>{VIEWS.STORY}</h4>
        <h4 onClick={() => this.switchView(VIEWS.WORK)}>{VIEWS.WORK}</h4>
        <h4 onClick={() => this.switchView(VIEWS.CONTACT)}>{VIEWS.CONTACT}</h4>
        <h4 onClick={() => this.switchView(VIEWS.ADVENTURES)}>{VIEWS.ADVENTURES}</h4>
    </nav>
     {getAboutComponent(this.state.view)}
  </Page>);
  }
}

export default About;