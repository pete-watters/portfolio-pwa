import React from 'react';
import CONFIG from '../constants';
import Icon from './Icon';

const SocialMedia = () =>
  <>
    <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
    <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
    <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
    <Icon icon="medium" href={CONFIG.SOCIAL.MEDIUM} />
    <Icon icon="instagram" href={CONFIG.SOCIAL.INSTAGRAM} />
  </>;

export default SocialMedia;
