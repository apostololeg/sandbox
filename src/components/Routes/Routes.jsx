import { withStore } from 'justorm/react';

import { Router, Route, Lazy, dom } from 'uilib';

import Home from 'components/Home/Home';
import Auth from 'components/App/Auth/Auth';

import NoMatch from './NoMatch';

dom.watchControllerFlag();

export default withStore({
  user: ['isInited', 'isLogged', 'isEditor', 'isAdmin'],
})(function Routes({ store }) {
  const { isInited, isLogged, isEditor, isAdmin } = store.user;

  if (!isInited) return null;

  return (
    <Router>
      <Route exact path="/" component={Home} />

      <Route
        path="/posts"
        exact
        component={Lazy}
        loader={() => import('components/PostList/PostList')}
      />
      <Route
        component={Lazy}
        exact
        path="/post/:slug"
        loader={() => import('components/Post/Post')}
      />

      {isLogged && (
        <Route
          component={Lazy}
          key="/profile"
          path="/profile"
          loader={() => import('components/Profile/Profile')}
        />
      )}
      {isLogged && (
        <Route component={Auth} path="/logout" key="/logout" type="logout" />
      )}

      {!isLogged && (
        <Route
          component={Auth}
          path="/register"
          key="/register"
          type="register"
        />
      )}
      {!isLogged && (
        <Route component={Auth} path="/login" key="/login" type="login" />
      )}

      {isAdmin && (
        <Route
          component={Lazy}
          path="/admin"
          loader={() => import('components/Admin/Admin')}
        />
      )}

      {(isEditor || isAdmin) && [
        <Route
          component={Lazy}
          key="/posts/new"
          path="/posts/new"
          exact
          loader={() => import('components/Post/New')}
        />,
        <Route
          component={Lazy}
          key="/post/:id/edit"
          path="/post/:id/edit"
          loader={() => import('components/Post/PostEditor/PostEditor')}
        />,
        <Route
          component={Lazy}
          key="/post/:slug/preview"
          path="/post/:slug/preview"
          loader={() => import('components/Post/Post')}
          preview
        />,
      ]}

      <Route component={NoMatch} />
    </Router>
  );
});
