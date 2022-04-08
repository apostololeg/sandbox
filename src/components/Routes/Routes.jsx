import { withStore } from 'justorm/react';

import { Router, Lazy } from 'uilib';

import Home from 'components/Home/Home';
import Auth from 'components/App/Auth/Auth';

import NoMatch from './NoMatch';

export default withStore({
  user: ['isLogged', 'isEditor', 'isAdmin'],
})(function Routes({ store }) {
  const { isLogged, isEditor, isAdmin } = store.user;

  return (
    <Router>
      <Home path="/" exact />
      <Auth path="/register" type="register" />
      <Auth path="/login" type="login" />
      <Auth path="/logout" type="logout" />

      <Lazy
        path="/posts"
        exact
        loader={() => import('components/PostList/PostList')}
      />
      <Lazy path="/posts/:slug" loader={() => import('components/Post/Post')} />

      {isLogged && (
        <Lazy
          path="/profile"
          loader={() => import('components/Profile/Profile')}
        />
      )}

      {isAdmin && (
        <Lazy path="/admin" loader={() => import('components/Admin/Admin')} />
      )}

      {(isEditor || isAdmin) && [
        <Lazy
          key="/posts/new"
          path="/posts/new"
          exact
          loader={() => import('components/Post/PostEditor/PostEditor')}
        />,
        <Lazy
          key="/posts/:slug/edit"
          path="/posts/:slug/edit"
          loader={() => import('components/Post/PostEditor/PostEditor')}
        />,
        <Lazy
          key="/posts/:slug/preview"
          path="/posts/:slug/preview"
          loader={() => import('components/Post/Post')}
          preview
        />,
      ]}

      <NoMatch />
    </Router>
  );
});
