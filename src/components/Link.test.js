import React from 'react';
import { shallow } from 'enzyme';
import Link from './Link';

const linkMock = {
  href : 'https://pete.com',
  text : 'Test'
}

let wrapped = shallow(<Link href={linkMock.href} text={linkMock.text}/>);
describe('Title', () => {
  it('should render the Link Component correctly', () => {   
    expect(wrapped).toMatchSnapshot();
  });
  it('renders the Link text', () => { 
    expect(wrapped.find('a').text()).toEqual(linkMock.text);
    expect(wrapped.find('a').prop('href')).toEqual(linkMock.href);
  });
});