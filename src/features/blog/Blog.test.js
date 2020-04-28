import React from 'react';
import { shallow } from 'enzyme';
import Blog from './Blog';

const component = shallow(<Blog />);

describe('Blog', () => {
  it('should render the component correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
