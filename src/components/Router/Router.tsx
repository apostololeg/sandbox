import { Component, cloneElement } from 'react';
import { withStore } from 'justorm/react';
import PathParser from 'path-parser';

require('./store');

function parseRouteParams(routes) {
  const items = [];
  const exactItems = [];

  function parse(route) {
    if (!route) {
      return;
    }

    if (Array.isArray(route)) {
      route.forEach(parse);
      return;
    }

    const { path, exact, children } = route.props;

    if (children) {
      children.forEach(parse);
      return;
    }

    const defaultParams = { path, exact, Elem: route };

    if (!path) {
      exactItems.unshift(defaultParams);
      return;
    }

    (exact ? exactItems : items).push({
      ...defaultParams,
      parsed: new PathParser(path),
    });
  }

  parse(routes);

  return [...exactItems, ...items];
}

@withStore({ router: ['path'] })
class Router extends Component {
  listeners = [];

  constructor(props) {
    super(props);
    this.rebuildRoutes(props.children);
  }

  shouldComponentUpdate(nextProps) {
    this.rebuildRoutes(nextProps.children);
    return true;
  }

  rebuildRoutes(items) {
    this.routes = parseRouteParams(items);
  }

  getRoute() {
    let params;
    const { router } = this.props.store;
    const route =
      this.routes.find(({ path, exact, parsed }) => {
        if (exact && path === router.path) return true;
        if (parsed) params = parsed.test(router.path);
        return Boolean(params);
      }) || this.routes[0];

    return [route, params];
  }

  render() {
    const { router } = this.props.store;
    const [route, params] = this.getRoute();
    const props = {
      ...params,
      router,
    };

    return cloneElement(route.Elem, props);
  }
}

export default Router;
export * from './Link/Link';
export { default as Redirect } from './Redirect/Redirect';
