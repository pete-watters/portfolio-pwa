import React, { PureComponent } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Page from '../components/Page';
import { Adventures, Contact, Story, Work } from '../components/about';

const createCarouselItemImage = (index) => (
  <div key={index}>
      <img src={`img/about/${index}.jpg`} alt='' />
  </div>
);

const imageArray = [
 'sled',
 'whistler',
 'yosemite',
 'yosemite1',
 'hawaii',
 'kayak',
 'benbulben',
 'muckish',
 'moher',
];

const baseChildren = <div>{ imageArray.map(createCarouselItemImage) }</div>;

class About extends PureComponent {
  constructor (props) {
      super(props);

      this.state = {
          slides: null
      };

      this.loadSlides = this.loadSlides.bind(this);
  }

  loadSlides() {
      this.setState({
          slides: baseChildren.props.children
      });
  }

  render(){
    return (
    <Page> 
    <nav>
        <h4>Story</h4>
        <h4 onClick={this.loadSlides}>Adventures</h4>
        <h4>Work</h4>
        <h4>Contact</h4>
    </nav>
    <Adventures />
    <Contact />
    <Story />
    <Work />
    
    <div>
        <Carousel showArrows={false} showThumbs={false} showStatus={false} showIndicators={false} infiniteLoop autoPlay>
            { this.state.slides }
        </Carousel>
    </div>

  </Page>);
  }
}

export default About;