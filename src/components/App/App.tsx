import { hot } from 'react-hot-loader/root';
import { Theme, VH } from 'uilib';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import 'store';

import Flex from 'components/UI/Flex/Flex';
import { Container, Notifications } from 'uilib';
// import Notifications from 'components/UI/Notifications/Notifications';

import Routes from 'components/Routes/Routes';
import Header from 'components/Header/Header';

import S from './App.styl';
import { useEffect } from 'react';

require('./store');

const App = withStore(['app', { user: [] }])(({ store }) => {
  const { app, user } = store;
  const { currThemeConfig, theme } = app.originalObject;

  useEffect(() => {
    user.init();
  }, []);

  return (
    <Flex className={cn(S.root, `theme-${theme}`)}>
      <VH />
      <Theme config={currThemeConfig} />
      <Header />
      <Container className={S.content} vertical fullWidth fullHeight size="m">
        <Routes />
      </Container>
      <Notifications />
    </Flex>
  );
});

export default PRODUCTION ? App : hot(App);
