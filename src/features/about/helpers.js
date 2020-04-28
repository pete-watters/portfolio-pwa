import React from 'react';
import { Adventures, Contact, Story, Work } from './components';
import { VIEWS } from './constants';

export const getAboutComponent = view => {
  switch (view) {
    case VIEWS.ADVENTURES:
      return <Adventures />;
    case VIEWS.CONTACT:
      return <Contact />;
    case VIEWS.STORY:
    default:
      return <Story />;
    case VIEWS.WORK:
      return <Work />;
  }
};
