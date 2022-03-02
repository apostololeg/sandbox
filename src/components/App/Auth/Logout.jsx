import { Component } from 'react';
import { bind } from 'decko';
import { withStore } from 'justorm/react';
import Time from 'timen';

import { Spinner } from 'uilib';

import s from './Auth.styl';

const REDIRECT_TIMEOUT = 500;

@withStore({ user: ['isLogged'] })
class Logout extends Component {
  clearTimer;

  componentDidMount() {
    const { isLogged } = this.props.store.user;

    if (!isLogged) {
      this.redirect();
      return;
    }

    this.logout();
  }

  componentWillUnmount() {
    this.clearTimer?.();
  }

  async logout() {
    const { logout } = this.props.store.user;
    const startTime = Date.now();
    await logout();
    const delay = REDIRECT_TIMEOUT - (Date.now() - startTime);

    if (delay <= 0) {
      this.redirect();
      return;
    }

    this.clearTimer = Time.after(delay, this.redirect);
  }

  @bind
  redirect() {
    const { navigate } = this.props.router;

    navigate('/', { replace: true });
  }

  render() {
    return (
      <div className={s.wrap}>
        logging out
        <Spinner paddedX />
      </div>
    );
  }
}
export default Logout;
