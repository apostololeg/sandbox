import Logo from 'components/Logo/Logo';
import { useCallback, useEffect, useState } from 'react';
import { rangeMap, debounce } from '@foreverido/uilib';

import S from './ScreenSaver.styl';

const ROTATE = 60;

export function ScreenSaver() {
  const [transform, setTransform] = useState('');

  const updateTransform = useCallback(
    debounce(e => {
      const { clientWidth: w, clientHeight: h } = document.body;
      const x = rangeMap(e.x, 0, w, -ROTATE, ROTATE);
      const y = rangeMap(e.y, 0, h, ROTATE, -ROTATE);

      setTransform(`rotateX(${y}deg) rotateY(${x}deg)`);
    }, 100),
    []
  );

  useEffect(() => {
    document.body.addEventListener('pointermove', updateTransform);
    return () => {
      document.body.removeEventListener('pointermove', updateTransform);
    };
  }, []);

  return (
    <div className={S.root}>
      <Logo className={S.inner} style={{ transform }} />
    </div>
  );
}
