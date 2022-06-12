import { Link } from 'uilib';

import { ScreenSaver } from 'components/ScreenSaver/ScreenSaver';
import Menu, { MenuItem } from 'components/UI/Menu/Menu';
import { Title } from 'components/Header/Header';
import { Gap } from 'components/UI/Flex/Flex';

import S from './Home.styl';

function Home() {
  return [
    <Title text="~/apostol" key="title" />,
    <Menu key="menu">
      <MenuItem>
        <Link href="/posts">Posts</Link>
      </MenuItem>
    </Menu>,
    <ScreenSaver />,
    <Gap />,
    <div className={S.version}>v{VERSION}</div>,
  ];
}

export default Home;
