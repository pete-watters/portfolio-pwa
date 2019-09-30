import React, { PureComponent } from 'react';
import axios from 'axios';
import Page from '../components/Page';

class Blog extends PureComponent {

  componentDidMount(){
    axios
      .get('https://medium.com/@peter.j.watters/?format=json', { crossdomain: true })
      .then(({ data })=> {
      	console.log(data);
      })
      .catch((err)=> {})
  }
  render(){
    return(<Page> 
      <p>Blog</p>
  </Page>)
  }
}

export default Blog;