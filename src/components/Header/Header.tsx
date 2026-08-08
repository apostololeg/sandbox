import { Container } from 'uilib';
import { useStore } from 'justorm/react';

import Logo from 'components/Logo/Logo';
import { useApp } from 'components/App/store';

import s from './Header.styl';

export default function Header() {
  const app = useApp(['isEmbed']);
  const { router } = useStore({ router: ['path'] });
  const { isEmbed } = app;
  const isRoot = router.path === '/';

  return (
    <Container className={s.root} size="m">
      {!isEmbed && !isRoot && <Logo />}
      <div className={s.title} id="app-title" />
    </Container>
  );
}

export { default as Title, Gap } from './Title/Title';
