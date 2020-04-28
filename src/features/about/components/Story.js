import React from 'react';
import Link from 'components/Link';

const Story = () =>
  <article>
    <div>
      <p>
        Full stack developer, JavaScript enthusiast and UX specialist.
        I have been developing browser based applications since 2005.
        I am a hobbyist coder who loves what I do and consider myself
        a true craftsman with a focus on clean scalable code and elegant but intuitive UX.
      </p>
      <p>
        An engineer since birth and have the academic credentials to back it up
        with B.Eng and M.Eng from <Link href="https://dcu.ie" text="DCU" />.
        I am also a member of <Link href="https://www.engineersireland.ie/" text="Engineers Ireland" />.
      </p>
      <p>
        I have a passion for technology especially cryptocurrencies, IoT and renewable energy.
      </p>
      <p>
        Outside of work I am very interested in health and fitness.
        I love strength trainining and play 11 a side football.
        I also like to surf and snowboard whenever I can.
      </p>
    </div>
  </article>;

export default Story;
