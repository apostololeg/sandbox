import Logo from 'components/Logo/Logo';
import S from './ScreenSaver.styl';
import { rangeMap } from 'uilib';
import { useState } from 'react';
import { useThrottle } from 'hooks/useThrottle';

const ROTATE = 60;

export function ScreenSaver() {
  const [transform, setTransform] = useState('');

  const updateTransform = useThrottle(
    e => {
      const { clientWidth: w, clientHeight: h } = document.body;
      const x = rangeMap(e.clientX, 0, w, -ROTATE, ROTATE);
      const y = rangeMap(e.clientY, 0, h, ROTATE, -ROTATE);

      setTransform(`rotateX(${y}deg) rotateY(${x}deg)`);
    },
    100,
    {},
    []
  );

  return (
    <div className={S.root} onPointerMove={updateTransform}>
      <div className={S.bg} aria-hidden />
      <Logo className={S.inner} style={{ transform }} />
    </div>
  );
}
