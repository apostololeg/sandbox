import { Router, Route, Lazy, dom } from 'uilib';

import Home from 'components/Home/Home';

import NoMatch from './NoMatch';

dom.watchControllerFlag();

export default function Routes() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/post/:slug"
        component={Lazy}
        loader={() => import('components/Post/Post')}
      />
      <Route component={NoMatch} />
    </Router>
  );
}
