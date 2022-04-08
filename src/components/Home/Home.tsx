import { Link } from 'uilib';

import Menu, { MenuItem } from 'components/UI/Menu/Menu';
import { Title } from 'components/Header/Header';

function Home() {
  return [
    <Title text="~/apostol" key="title" />,
    <Menu key="menu">
      <MenuItem>
        <Link href="/posts">Posts</Link>
      </MenuItem>
    </Menu>,
  ];
}

export default Home;
