import pick from 'lodash.pick';
import { createStore } from 'justorm/react';
import { LS, RouterStore, array, queryParams } from '@foreverido/uilib';

import { DEFAULT_LANG } from 'shared/langs';

import { api } from 'tools/request';

import user from 'store/user';
import { getTextsFromData } from 'tools/posts';

const WRITABLE_FIELDS = [
  'author',
  'slug',
  'slugLock',
  'texts',
  'tags',
  'published',
];

function prefixEdits(slug) {
  return `edited-post-${slug}`;
}

const LS_LANG_FIELD = 'post-lang';

function getInitialLang() {
  const queryLang = queryParams.parseQueryParams()?.lang?.toUpperCase();
  return queryLang ?? LS.get(LS_LANG_FIELD) ?? DEFAULT_LANG;
}

const STORE = createStore('posts', {
  items: [], // [id, id,...]
  byId: {}, // [id]: data
  bySlug: {}, // [slug]: data
  textsById: {}, // [textId]: data
  localEdits: {}, // [id]: data
  lang: getInitialLang(),
  loadingList: false,
  loading: {},
  updating: {},
  deleting: {},
  creatingTexts: {},

  getLocalVersion(id) {
    if (!id) return null;
    if (!this.localEdits[id]) this.localEdits[id] = LS.get(prefixEdits(id));
    return this.localEdits[id]?.originalObject;
  },

  setLocalVersion(data) {
    if (!user.isEditor && !user.isAdmin) return;

    const { id } = data;

    this.localEdits[id] = data;
    LS.set(prefixEdits(id), data);
  },

  getPostById(slug) {
    return this.byId[slug];
  },

  async loadPost(id) {
    if (!id || this.loading[id] || this.byId[id] || this.bySlug[id]) return;

    this.loading[id] = true;

    try {
      const data = await api.get(`/posts/${id}`);

      this.setLocalVersion({ ...data });
      setItem({ data });
    } finally {
      delete this.loading[id];
    }
  },

  async loadPosts(params?) {
    this.loadingList = true;
    const res = await api.get('/posts', params ? { data: params } : null);
    this.loadingList = false;

    res.forEach(data => setItem({ data }));
  },

  setLang(lang, postId?) {
    this.lang = lang;
    LS.set(LS_LANG_FIELD, lang);

    if (postId) {
      this.loadCurrentTexts(postId);
      RouterStore.replaceState(
        `${RouterStore.path}?lang=${lang.toLowerCase()}`
      );
    }
  },

  async createPost() {
    const res = await api.post('/posts/new', { data: { lang: this.lang } });

    this.setLocalVersion(res);
    setItem({ data: res });
    return res;
  },

  async updatePost({ id, data }) {
    this.updating[id] = true;
    const { lang } = this;

    const res = await api.post(`/posts/${id}`, {
      data: pick(data, WRITABLE_FIELDS),
    });

    delete this.updating[id];

    data.texts.map(text => {
      const textId = text.id ?? res.texts.find(t => t.lang === lang)?.id;
      STORE.textsById[textId] = text;
    });

    setItem({ data: res });
  },

  async deletePost(id) {
    this.deleting[id] = true;
    await api.delete(`/posts/${id}`);
    delete this.deleting[id];
    delItem(id);
  },

  async createText(id) {
    const { lang } = this;
    const data = { texts: [{ lang, title: '', content: '' }] };
    const key = this.getTextStateKey(id);

    this.creatingTexts[key] = true;

    try {
      await this.updatePost({ id, data });
    } finally {
      this.creatingTexts[key] = false;
    }
  },

  isTextCreating(id) {
    return this.creatingTexts[this.getTextStateKey(id)];
  },

  getTextStateKey(id) {
    return `${id}-${this.lang}`;
  },

  loadCurrentTexts(id) {
    const data = this.byId[id];
    const texts = getTextsFromData(data, this.lang);

    return this.loadTexts(texts.id);
  },

  async loadTexts(id) {
    if (this.textsById[id]) return;

    const data = await api.get(`/posts/texts/${id}`);

    this.textsById[id] = data;
  },
});

function setItem({ data, toTop = false }) {
  const { id, slug } = data;

  STORE.byId[id] = data;
  STORE.bySlug[slug] = data;

  if (!STORE.items.includes(id)) STORE.items[toTop ? 'unshift' : 'push'](id);
}

// function setItems(data) {
//   const byId = {};
//   const items = [];

//   data.forEach(item => setItem({ data: item, items, byId }));

//   STORE.byId = { ...STORE.byId.originalObject, ...byId };
//   STORE.items = [...STORE.items.originalObject, ...items];
// }

// function updateItem(slug, data) {
//   const existedData = STORE.byId[slug];

//   if (!existedData) return setItem({ data });

//   STORE.byId[slug] = Object.assign({ ...existedData.originalObject }, data);
// }

function delItem(id) {
  const data = STORE.byId[id];

  if (!data) return;

  array.spliceWhere(STORE.items, id);
  delete STORE.byId[id];
  delete STORE.bySlug[data.slug];
}
