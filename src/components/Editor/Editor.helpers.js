import ReactDOM from 'react-dom';
import { Link } from '@foreverido/uilib';

const COMPONENTS_TO_HYDRATE = {
  Link,
};

export function hydrateComponents(rootNode) {
  const nodes = rootNode.querySelectorAll('[data-props]:not([data-inited])');

  nodes.forEach(node => {
    const { component, ...props } = JSON.parse(node.dataset.props);
    const C = COMPONENTS_TO_HYDRATE[component];

    if (C) {
      node.innerHTML = '';
      ReactDOM.render(<C {...props} />, node);
      node.setAttribute('data-inited', '');
    }
  });
}
