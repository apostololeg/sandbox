import { Container } from 'uilib';
import Logo from 'components/Logo/Logo';
import s from './Header.styl';
import { useApp } from 'components/ErrorBoundary/App/store';
import { useStore } from 'justorm/react';

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
