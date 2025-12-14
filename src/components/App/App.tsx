import { Theme, VH, Container, Notifications } from 'uilib';
import cn from 'classnames';

import 'store';

import Flex from 'components/UI/Flex/Flex';
import Routes from 'components/Routes/Routes';
import Header from 'components/Header/Header';
import { useApp } from './store';
import { useUser } from 'store/user';

import S from './App.styl';
import { useEffect } from 'react';

require('./store');

function App() {
  const app = useApp(['currThemeConfig', 'theme', 'isEmbed']);
  const user = useUser([]);
  const { currThemeConfig, theme, isEmbed } = app;

  useEffect(() => {
    if (!isEmbed) user.init();
  }, [isEmbed]);

  return (
    <Flex className={cn(S.root, `theme-${theme}`)}>
      <VH />
      <Theme config={currThemeConfig} />
      <Header />
      <Container className={S.content} vertical fullWidth fullHeight>
        <Routes />
      </Container>
      <Notifications />
    </Flex>
  );
}

export default App;
