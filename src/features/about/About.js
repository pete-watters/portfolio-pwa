import React, { PureComponent } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Page from 'components/Page';
import { VIEWS } from './constants';
import { getAboutComponent } from './helpers';

class About extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      view: null,
    };

    this.switchView = this.switchView.bind(this);
  }

  switchView(view) {
    this.setState({ view });
  }

  render() {
    const { view } = this.state;
    const ENTER_KEY_CODE = 13;
    return (
      <Page>
        <nav>
          <ul>
            {/* FIXME refactor this - abstract to clickable div element component */}
            <li><div tabIndex="0" role="button" onClick={() => this.switchView(VIEWS.STORY)} onKeyPress={e => e.keyCode === ENTER_KEY_CODE && this.switchView(VIEWS.STORY)}><h4>{VIEWS.STORY}</h4></div></li>
            <li><div tabIndex="0" role="button" onClick={() => this.switchView(VIEWS.WORK)} onKeyPress={e => e.keyCode === ENTER_KEY_CODE && this.switchView(VIEWS.STORY)}><h4>{VIEWS.WORK}</h4></div></li>
            <li><div tabIndex="0" role="button" onClick={() => this.switchView(VIEWS.CONTACT)} onKeyPress={e => e.keyCode === ENTER_KEY_CODE && this.switchView(VIEWS.STORY)}><h4>{VIEWS.CONTACT}</h4></div></li>
            <li><div tabIndex="0" role="button" onClick={() => this.switchView(VIEWS.ADVENTURES)} onKeyPress={e => e.keyCode === ENTER_KEY_CODE && this.switchView(VIEWS.STORY)}><h4>{VIEWS.ADVENTURES}</h4></div></li>
          </ul>
        </nav>
        {getAboutComponent(view)}
      </Page>);
  }
}

export default About;
