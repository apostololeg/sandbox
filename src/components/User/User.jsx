import { withStore } from 'justorm/react';

import { Popup, Link } from 'uilib';

import Menu, { MenuItem } from 'components/UI/Menu/Menu';

import DefaultIcon from './icons/avatar.svg';
import s from './User.styl';

function Userpic({ url }) {
  if (!url) {
    return <DefaultIcon className={s.avatar} />;
  }

  return (
    <div className={s.avatar} style={{ backgroundImage: `url(${url})` }} />
  );
}

function getMenuLinks({ isAuth, isLogged, isAdmin }) {
  const items = [];

  if (isLogged) {
    if (isAdmin) {
      items.push(['/admin', 'Admin panel']);
    }

    items.push(['/profile', 'Profile'], ['/logout', 'Logout']);
  } else if (!isAuth) {
    items.push(['/login', 'Sign in']);
  }

  return items;
}

export default withStore({
  user: ['isLogged', 'isAdmin', 'email', 'name', 'avatar'],
  page: ['isAuth'],
})(function User({ store }) {
  const { isLogged, isAdmin, email, name, avatar } = store.user;
  const { isAuth } = store.page;

  if (!isLogged) return null;

  const items = getMenuLinks({ isLogged, isAdmin, isAuth });

  return (
    <Popup
      autoClose
      direction="bottom-left"
      trigger={
        <div className={s.user} tabIndex={0}>
          <div className={s.userName}>{email || name || 'Guest'}</div>
          <Userpic url={avatar} />
        </div>
      }
      content={
        items.length > 0 && (
          <Menu className={s.menu} align="right">
            {items.map(([path, text]) => (
              <MenuItem key={path}>
                <Link href={path}>{text}</Link>
              </MenuItem>
            ))}
          </Menu>
        )
      }
    />
  );
});
