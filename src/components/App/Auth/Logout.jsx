import { useEffect } from 'react';
import Time from 'timen';
import { useStore } from 'justorm/react';

import { Spinner } from 'uilib';
import { useUser } from 'store/user';

import s from './Auth.styl';

const REDIRECT_TIMEOUT = 500;

export default function Logout({ router }) {
  const user = useUser(['isLogged']);

  useEffect(() => {
    let clearTimer;

    async function logout() {
      const startTime = Date.now();
      await user.logout();
      const delay = REDIRECT_TIMEOUT - (Date.now() - startTime);

      if (delay <= 0) {
        redirect();
        return;
      }

      clearTimer = Time.after(delay, redirect);
    }

    function redirect() {
      router.navigate('/', { replace: true });
    }

    if (!user.isLogged) {
      redirect();
      return;
    }

    logout();

    return () => {
      clearTimer?.();
    };
  }, [user, router]);

  return (
    <div className={s.wrap}>
      logging out
      <Spinner paddedX />
    </div>
  );
}
