import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAdjust } from '@fortawesome/free-solid-svg-icons';

library.add(faAdjust);

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
