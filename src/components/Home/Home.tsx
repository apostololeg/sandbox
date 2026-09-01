import { useState } from 'react';
import cn from 'classnames';
import { Icon, Link, Scroll } from 'uilib';

import { ScreenSaver } from 'components/ScreenSaver/ScreenSaver';
import { Title } from 'components/Header/Header';
import { Gap } from 'components/UI/Flex/Flex';
import Projects from './Projects/Projects';

import S from './Home.styl';

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
        <div className={S.donate}>
          If you like what im doing -{' '}
          <Link
            href="https://revolut.me/apostololeg"
            target="_blank"
            rel="noopener noreferrer"
          >
            send me some money
          </Link>{' '}
          for tokens, or <Link href="//contacts">contact me</Link>
        </div>
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
