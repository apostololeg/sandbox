import { createStore } from 'justorm/react';
import { api } from 'tools/request';

const DEFAULT_DATA = {
  inProgress: false,
  isLogged: false,
  isAdmin: false,
};

const STORE = createStore('user', {
  id: null,
  avatar: '',
  name: '',
  role: 'GUEST',
  permissions: {},

  inProgress: true,
  isLogged: false,
  isAdmin: false,
  isEditor: false,

  async init() {
    try {
      const res = await api.get('/users/me');

      if (res) setUser(res);
      else if (/^localhost/.test(location.host)) this.loginas(1);
    } catch (e) {
      console.error('store/user:init()', e?.message);
    }
  },

  async register(data) {
    const res = await api.post('/auth/register', { data });

    console.log('res', res);
  },

  async login(data) {
    const res = await api.post('/auth/login', { data });
    debugger;
    setUser(res);
  },

  async loginas(id) {
    const res = await api.get(`/auth/loginas/${id}`);
    setUser(res);
  },

  async logout() {
    await api.get('/auth/logout');
    setUser(null);
  },
});

function setUser(data) {
  if (!data) {
    Object.assign(STORE, { ...DEFAULT_DATA });
    return;
  }

  Object.assign(STORE, data, {
    inProgress: false,
    isLogged: true,
    isAdmin: data.roles.includes('ADMIN'),
    isEditor: data.roles.includes('EDITOR'),
  });
}

export default STORE;
