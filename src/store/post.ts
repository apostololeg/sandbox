import pick from 'lodash.pick';
import { createStore } from 'justorm/react';

import LS from 'tools/localStorage';
import { api } from 'tools/request';
import { setListMap, delListMap } from 'tools/array';

const WRITABLE_FIELDS = [
  'author',
  'slug',
  'slugLock',
  'title',
  'content',
  'tags',
  'published',
];
const DEFAULT_POST = {
  author: null,
  published: false,
  slugLock: false,
  slug: '',
  title: '',
  content: '',
  tags: [],
};

const POST_BY_SLUG = {};

function prefixEdits(slug) {
  return `editor-post-${slug}`;
}

createStore('posts', {
  list: [],
  localEdits: {},
  loadingList: false,
  loading: {},
  updating: {},
  deleting: {},

  getLocalVersion(slug) {
    this.localEdits[slug] = LS.get(prefixEdits(slug));
    return this.localEdits[slug];
  },

  setLocalVersion(data) {
    const { slug } = data;

    this.localEdits[slug] = data;
    LS.set(prefixEdits(slug), data);
  },

  getPostBySlug(slug) {
    return POST_BY_SLUG[slug];
  },

  async loadPost(slug) {
    if (this.loading[slug]) return;

    this.loading[slug] = true;
    const data = await api.get(`/posts/${slug}`);

    delete this.loading[slug];
    setListMap(this.list, POST_BY_SLUG, data, 'slug');
  },

  async loadPosts(where) {
    this.loadingList = true;
    const params = where ? { data: { where } } : null;
    const res = await api.get('/posts', params);
    this.loadingList = false;

    res.forEach(data => setListMap(this.list, POST_BY_SLUG, data, 'slug'));
  },

  async createPost(data) {
    const { slug } = data;
    const params = {
      data: pick({ ...DEFAULT_POST, ...data }, WRITABLE_FIELDS),
    };

    this.loading[slug] = true;
    const res = await api.post('/posts/new', params);

    delete this.loading[slug];
    this.setLocalVersion(res);
    setListMap(this.list, POST_BY_SLUG, res, 'slug');
    return res;
  },

  async updatePost({ id, data }) {
    this.updating[id] = true;

    const res = await api.post(`/posts/${id}`, {
      data: pick(data, WRITABLE_FIELDS),
    });

    delete this.updating[id];

    this.setLocalVersion(res);
    setListMap(this.list, POST_BY_SLUG, res, 'slug');
  },

  async deletePost(slug) {
    const { id } = POST_BY_SLUG[slug];

    this.deleting[slug] = true;
    await api.delete(`/posts/${id}`);
    delete this.deleting[slug];
    delListMap(this.list, POST_BY_SLUG, 'slug', slug);
  },
});
