/* eslint-disable no-magic-numbers */
import React from 'react';
import { shallow } from 'enzyme';
import About from './About';
import { VIEWS } from './constants';

const component = shallow(<About />);

describe('About', () => {
  it('should render the component correctly', () => {
    expect(component).toMatchSnapshot();
  });
  it('renders the correct text', () => {
    expect(component.find('h4').at(0).text()).toEqual(VIEWS.STORY);
    expect(component.find('h4').at(1).text()).toEqual(VIEWS.WORK);
    expect(component.find('h4').at(2).text()).toEqual(VIEWS.CONTACT);
    expect(component.find('h4').at(3).text()).toEqual(VIEWS.ADVENTURES);
  });
});
