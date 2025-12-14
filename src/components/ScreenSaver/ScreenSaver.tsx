import Logo from 'components/Logo/Logo';
import { useCallback, useEffect, useState } from 'react';
import { rangeMap, debounce, useDebounceCallback } from 'uilib';

import S from './ScreenSaver.styl';
import { useThrottle } from 'hooks/useThrottle';

const ROTATE = 60;

export function ScreenSaver() {
  const [transform, setTransform] = useState('');

  const updateTransform = useThrottle(
    e => {
      const { clientWidth: w, clientHeight: h } = document.body;
      const x = rangeMap(e.clientX, 0, w, -ROTATE, ROTATE);
      const y = rangeMap(e.clientY, 0, h, ROTATE, -ROTATE);

      console.log('### updateTransform()');
      setTransform(`rotateX(${y}deg) rotateY(${x}deg)`);
    },
    100,
    {},
    []
  );

  return (
    <div className={S.root} onPointerMove={updateTransform}>
      <Logo className={S.inner} style={{ transform }} />
    </div>
  );
}
