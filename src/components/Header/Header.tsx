import { Container } from 'uilib';

import User from 'components/User/User';
import Logo from 'components/Logo/Logo';

import s from './Header.styl';

const Header = () => (
  <Container className={s.root} size="m">
    <Logo />
    <div className={s.title} id="app-title" />
    <User />
  </Container>
);

export default Header;
export { default as Title, Gap } from './Title/Title';
