import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import Time from 'timen';
import { usePage } from 'store/page';

import s from './Title.styl';

export function Gap() {
  return <div className={s.gap} />;
}

function getNode() {
  return document.getElementById('app-title');
}

function waitForNode() {
  return new Promise<void>(resolve => {
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
  text: string;
  children?: ReactNode;
};

export default function Title({ text, children }: Props) {
  const page = usePage(['title']);
  const prevTitleRef = useRef<string>();

  useEffect(() => {
    async function init() {
      if (getNode()) {
        await waitForNode();
      }
      page.setTitle(text);
    }

    if (prevTitleRef.current !== text) {
      init();
      prevTitleRef.current = text;
    }
  }, [text, page]);

  const { title } = page;
  const targetNode = getNode();

  if (!targetNode) return null;

  return createPortal(
    <>
      {title && <h1 className={s.title}>{title}</h1>}
      {children}
    </>,
    targetNode
  );
}
