import React, { memo } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

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

const Adventures = () => 
            <Carousel showArrows={false} showThumbs={false} showStatus={false} showIndicators={false} infiniteLoop autoPlay>
                {baseChildren.props.children}
            </Carousel>;

export default memo(Adventures);