import React, { memo } from 'react';
import Icon from './Icon';
import CONFIG from '../constants';

const SocialMedia = () =>
    <>
      <Icon icon="twitter" href={CONFIG.SOCIAL.TWITTER} />
      <Icon icon="github" href={CONFIG.SOCIAL.GITHUB} />
      <Icon icon="linkedIn" href={CONFIG.SOCIAL.LINKEDIN} />
      <Icon icon="stackOverflow" href={CONFIG.SOCIAL.STACKOVERFLOW} />
      <Icon icon="medium" href={CONFIG.SOCIAL.MEDIUM} />
      <Icon icon="instagram" href={CONFIG.SOCIAL.INSTAGRAM} />
    </>;

export default memo(SocialMedia);