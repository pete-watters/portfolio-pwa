import React from 'react';
import { shallow } from 'enzyme';
import Page from './Page';

describe('Page', () => {
  it('should render the component correctly', () => {
    expect(shallow(<Page />)).toMatchSnapshot();
  });
});
