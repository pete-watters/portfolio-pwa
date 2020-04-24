import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';


const component = shallow(<Home />);

describe('Home', () => {
  it('should render the component correctly', () => {   
    expect(component).toMatchSnapshot();
  });
  it('renders the correct text', () => { 
    expect(component.find('p:first-child').text()).toEqual("Full stack developer, UX specialist and JavaScript enthusiast.");
  });
});