import { Container } from 'uilib';
import { withStore } from 'justorm/react';

import User from 'components/User/User';
import Logo from 'components/Logo/Logo';

import s from './Header.styl';

const Header = withStore({
  app: 'isEmbed',
  router: 'path',
})(({ store }) => {
  const { isEmbed } = store.app;
  const isRoot = store.router.path === '/';

  return (
    <Container className={s.root} size="m">
      {!isEmbed && !isRoot && <Logo />}
      <div className={s.title} id="app-title" />
      {!isEmbed && <User />}
    </Container>
  );
});

export default Header;
export { default as Title, Gap } from './Title/Title';
