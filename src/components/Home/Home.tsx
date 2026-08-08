import { Scroll } from 'uilib';

import { ScreenSaver } from 'components/ScreenSaver/ScreenSaver';
import { Title } from 'components/Header/Header';
import { Gap } from 'components/UI/Flex/Flex';
import Projects from './Projects/Projects';

import S from './Home.styl';

function Home() {
  return [
    <Title text="~/apostol" key="title" />,

    <Scroll
      y
      className={S.scroll}
      innerClassName={S.scrollInner}
      fadeSize="xl"
      offset={{ y: { before: 20, after: 20 } }}
    >
      <ScreenSaver />
      <Projects />
      <Gap />
      <div className={S.version}>v{VERSION}</div>
    </Scroll>,
  ];
}

export default Home;
