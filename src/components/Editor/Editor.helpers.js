import ReactDOM from 'react-dom';
import { Link } from 'uilib';

import { Img, ImgEditable } from './embeds/components/Img';

const VIEW_COMPONENTS = {
  Link,
  Img,
};

const EDITABLE_COMPONENTS = {
  Img: ImgEditable,
};

export function hydrateComponents(rootNode, { isEditor } = {}) {
  const nodes = rootNode.querySelectorAll('[data-props]:not([data-inited])');

  nodes.forEach(node => {
    const { component, ...props } = JSON.parse(node.dataset.props);
    const C = isEditor
      ? EDITABLE_COMPONENTS[component] ?? VIEW_COMPONENTS[component]
      : VIEW_COMPONENTS[component];

    if (C) {
      node.innerHTML = '';
      ReactDOM.render(<C {...props} />, node);
      node.setAttribute('data-inited', '');
    }
  });
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export const bus = new EventTarget();
