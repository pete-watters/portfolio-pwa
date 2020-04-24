import React, { PureComponent } from 'react';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import CONFIG from 'constants/';
import Page from '../../components/Page';

class Blog extends PureComponent {
  state = { feed: {} } 
  componentDidMount() {
    this.fetchFeed().then(this.setFeed);
  }
  fetchFeed = () => axios.get(`https://us-central1-portfolio-8db27.cloudfunctions.net/api/medium`);
  setFeed = response => {
    this.setState({feed: response});
  } 
  render(){
    const { data } = this.state.feed;
      return(
      <Page>
          {data && data.items.map((post, index) => (
              <article key={index} onClick={() => window.open(post.link, "_blank")} aria-label="blog-post">
                <h1>{post.title}</h1>
                <summary>{ReactHtmlParser(post["content:encoded"])}</summary>
              </article>
            ))
            }
            <footer>
              <a href={CONFIG.SOCIAL.MEDIUM} target="_blank" rel="noopener noreferrer">
                {data && data.description}
              </a>
            </footer>
        </Page>);
  }
}

export default Blog;
