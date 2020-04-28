import React from 'react';
import { shallow } from 'enzyme';
import Icon from './Icon';

describe('Icon', () => {
  it('should render the component correctly', () => {
    expect(shallow(<Icon icon='faTwitter' href='#' onClick={null} />)).toMatchSnapshot();
  });
});
