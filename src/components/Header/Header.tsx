import { Container } from 'uilib';
import { withStore } from 'justorm/react';

import User from 'components/User/User';
import Logo from 'components/Logo/Logo';

import s from './Header.styl';

const Header = withStore({
  app: 'isEmbed',
})(({ store }) => {
  const { isEmbed } = store.app;

  return (
    <Container className={s.root} size="m">
      {!isEmbed && <Logo />}
      <div className={s.title} id="app-title" />
      {!isEmbed && <User />}
    </Container>
  );
});

export default Header;
export { default as Title, Gap } from './Title/Title';
