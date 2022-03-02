import { createStore } from 'justorm/react';
import { mutate, query } from 'tools/request';

import {
  LOAD_QUERY,
  INIT_MUTATION,
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
} from './query';

const STORE = createStore('user', {
  name: '',
  email: '',
  roles: ['guest'],
  isLogged: false,
  inProgress: false,
  async login(payload) {
    const data = await mutate(LOGIN_MUTATION, {
      ...progressInterface,
      variables: payload,
      dataAccessor: 'login',
    });

    setUser(data);
  },
  async register(payload) {
    const data = await mutate(REGISTER_MUTATION, {
      ...progressInterface,
      variables: payload,
      dataAccessor: 'register',
    });

    setUser(data);
  },
  async logout() {
    await mutate(LOGOUT_MUTATION);
    setUser({ name: '', email: '', roles: ['guest'] });
  },
});

const progressInterface = {
  getProgress: () => STORE.inProgress,
  setProgress: val => (STORE.inProgress = val),
};

function initAdmin() {
  if (!STORE.roles.includes('ADMIN')) {
    window.makeAdmin = async key => {
      const res = await mutate(INIT_MUTATION, { variables: { key } });
      const { roles } = res.init;

      if (roles.includes('ADMIN')) {
        setUser({ ...STORE, roles }); // eslint-disable-line
        console.log('Welcome, admin!');
        delete window.makeAdmin;
      }
    };
  }
}

function setUser(data) {
  Object.assign(STORE, data, {
    inProgress: false,
    isLogged: Boolean(data.email),
    isAdmin: data.roles.includes('ADMIN'),
  });

  initAdmin();
}

(async function init() {
  try {
    const data = await query(LOAD_QUERY, { dataAccessor: 'me' });
    setUser(data);
  } catch (e) {
    console.warn(e.message);
  }
})();

export default STORE;
