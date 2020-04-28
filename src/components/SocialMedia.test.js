import React from 'react';
import { shallow } from 'enzyme';
import SocialMedia from './SocialMedia';

describe('SocialMedia', () => {
  it('should render the component correctly', () => {
    expect(shallow(<SocialMedia />)).toMatchSnapshot();
  });
});
