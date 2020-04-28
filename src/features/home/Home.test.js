/* eslint-disable no-magic-numbers */
import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';

const component = shallow(<Home />);

describe('Home', () => {
  it('should render the component correctly', () => {
    expect(component).toMatchSnapshot();
  });
  it('renders the correct text', () => {
    expect(component.find('p').at(0).text()).toEqual('Full stack developer, UX specialist and JavaScript enthusiast.');
    expect(component.find('p').at(1).text()).toEqual('Academically qualified engineer and hobbyist coder turned craftsman.');
    expect(component.find('p').at(2).text()).toEqual('I specialise in well tested, clean scalable code with an elegant and intuitive UX.');
  });
});
