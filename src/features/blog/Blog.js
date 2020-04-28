import React, { PureComponent } from 'react';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import Page from 'components/Page';
import CONFIG from '../../constants';

class Blog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { feed: {} };
  }

  componentDidMount() {
    this.fetchFeed().then(this.setFeed);
  }

  fetchFeed = () => axios.get('https://us-central1-portfolio-8db27.cloudfunctions.net/api/medium');

  setFeed = response => {
    this.setState({ feed: response });
  }

  render() {
    const { feed: { data } } = this.state;
    return (
      <Page>
        {/* FIXME refactor this - abstract to clickable div element component */}
        {data && data.items.map(post => (
          <div role="button" tabIndex="0" key={post.link} onClick={() => window.open(post.link, '_blank')} onKeyPress={() => window.open(post.link, '_blank')} aria-label="blog-post">
            <article>
              <h1>{post.title}</h1>
              <summary>{ReactHtmlParser(post['content:encoded'])}</summary>
            </article>
          </div>
        ))}
        <footer>
          <a href={CONFIG.SOCIAL.MEDIUM} target="_blank" rel="noopener noreferrer">
            {data && data.description}
          </a>
        </footer>
      </Page>);
  }
}

export default Blog;
