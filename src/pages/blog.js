import React, { PureComponent } from 'react';
import axios from 'axios';
import Icon from '../components/Icon';
import Page from '../components/Page';

class Blog extends PureComponent {
  state = { posts: [] } 
  componentDidMount() {
    this.fetchPosts().then(this.setPosts);
  }
  fetchPosts = () => axios.get(`https://us-central1-portfolio-8db27.cloudfunctions.net/medium`);
  setPosts = response => {
    this.setState({
      posts: response
    });
  } 
  render(){
    return(
    <Page>
          <a href="https://medium.com/@peter.j.watters" target="_blank" rel="noopener noreferrer">
            View My Medium
          </a>
              <Icon icon="medium" href="https://medium.com/@peter.j.watters" />
          <pre>{JSON.stringify(this.state.posts, null, 2)}</pre>
      </Page>)
  }
}

export default Blog;