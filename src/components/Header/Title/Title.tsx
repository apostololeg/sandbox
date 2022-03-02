import { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';

import { withStore } from 'justorm/react';
import { bind } from 'decko';
import Time from 'timen';

import s from './Title.styl';

export function Gap() {
  return <div className={s.gap} />;
}

function getNode() {
  return document.getElementById('app-title');
}

function waitForNode() {
  return new Promise((resolve) => {
    function checkNode() {
      if (getNode()) {
        resolve();
      } else {
        Time.after(100, checkNode);
      }
    }

    checkNode();
  });
}

type Props = {
  store?: any;
  text: string;
};

@withStore({ page: ['title'] })
class Title extends Component<Props> {
  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    const { title } = this.props.store.page;

    if (title !== this.getTitle()) {
      this.init();
    }
  }

  async init() {
    if (getNode()) {
      await waitForNode();
      this.setTitle();
      return;
    }

    this.setTitle();
  }

  getTitle() {
    return this.props.text;
  }

  @bind
  setTitle() {
    const { setTitle } = this.props.store.page;

    setTitle(this.getTitle());
  }

  render() {
    const { children, store } = this.props;
    const { title } = store.page;
    const targetNode = getNode();

    if (!targetNode) return null;

    return createPortal(
      <Fragment>
        {title && <h1 className={s.title}>{title}</h1>}
        {children}
      </Fragment>,
      targetNode
    );
  }
}

export default Title;
