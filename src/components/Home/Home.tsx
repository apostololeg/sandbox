import { Icon, Scroll } from 'uilib';

import { Gap } from 'components/UI/Flex/Flex';
import Projects from './Projects/Projects';
import Donate from './Donate/Donate';
import S from './Home.styl';
import { ScreenSaver } from 'components/ScreenSaver/ScreenSaver';
import { Title } from 'components/Header/Header';
import cn from 'classnames';
import { useState } from 'react';

function Home() {
  const [scrolled, setScrolled] = useState(false);

  return [
    <Title text="~/apostol" key="title" />,

    <div className={S.root} key="content">
      <Scroll
        y
        className={S.scroll}
        innerClassName={S.scrollInner}
        fadeSize="xl"
        offset={{ y: { before: 20, after: 20 } }}
        onScroll={e => setScrolled((e.target as HTMLElement).scrollTop > 0)}
      >
        <ScreenSaver />
        <Projects />

        <Donate />
        <Gap />
        <div className={S.version}>v{VERSION}</div>
      </Scroll>
      <div className={cn(S.chevron, scrolled && S.hidden)} aria-hidden>
        <Icon type="chevronDown" size="l" />
      </div>
    </div>,
  ];
}

export default Home;
