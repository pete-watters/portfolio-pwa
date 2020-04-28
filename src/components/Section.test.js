import React from 'react';
import { shallow } from 'enzyme';
import Section from './Section';

describe('Section', () => {
  it('should render the component correctly', () => {
    expect(shallow(<Section />)).toMatchSnapshot();
  });
});
