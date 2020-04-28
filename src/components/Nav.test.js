import React from 'react';
import { shallow } from 'enzyme';
import Nav from './Nav';

describe('Nav', () => {
  it('should render the component correctly', () => {
    expect(shallow(<Nav />)).toMatchSnapshot();
  });
});
