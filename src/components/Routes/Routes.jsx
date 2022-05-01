import { withStore } from 'justorm/react';

import { Router, Lazy } from 'uilib';

import Home from 'components/Home/Home';
import Auth from 'components/App/Auth/Auth';

import NoMatch from './NoMatch';

export default withStore({
  user: ['isInited', 'isLogged', 'isEditor', 'isAdmin'],
})(function Routes({ store }) {
  const { isInited, isLogged, isEditor, isAdmin } = store.user;

  if (!isInited) return null;

  return (
    <Router>
      <Home path="/" />

      <Lazy
        path="/posts"
        loader={() => import('components/PostList/PostList')}
      />
      <Lazy path="/post/:slug" loader={() => import('components/Post/Post')} />

      {isLogged
        ? [
            <Lazy
              key="/profile"
              path="/profile"
              loader={() => import('components/Profile/Profile')}
            />,
            <Auth path="/logout" key="/logout" type="logout" />,
          ]
        : [
            <Auth path="/register" key="/register" type="register" />,
            <Auth path="/login" key="/login" type="login" />,
          ]}

      {isAdmin && (
        <Lazy path="/admin" loader={() => import('components/Admin/Admin')} />
      )}

      {(isEditor || isAdmin) && [
        <Lazy
          key="/posts/new"
          path="/posts/new"
          exact
          loader={() => import('components/Post/New')}
        />,
        <Lazy
          key="/post/:id/edit"
          path="/post/:id/edit"
          loader={() => import('components/Post/PostEditor/PostEditor')}
        />,
        <Lazy
          key="/post/:id/preview"
          path="/post/:id/preview"
          loader={() => import('components/Post/Post')}
          preview
        />,
      ]}

      <NoMatch />
    </Router>
  );
});
