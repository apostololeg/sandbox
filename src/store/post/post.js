import pick from 'lodash.pick';
import { createStore } from 'justorm/react';

import LS from 'tools/localStorage';
import { setListMap, delListMap } from 'tools/array';
import { mutate, query } from 'tools/request';

import { GET_POSTS, CREATE_POST, UPDATE_POST, DELETE_POST } from './query';

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

function getPosts(where) {
  return query(GET_POSTS, {
    variables: { where },
    dataAccessor: 'getPosts',
    fetchPolicy: 'no-cache',
  });
}

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
    const res = await getPosts({ slug });
    const data = res[0];

    delete this.loading[slug];
    setListMap(this.list, POST_BY_SLUG, data, 'slug');
  },
  async loadPosts(where = {}) {
    this.loadingList = true;
    const res = await getPosts(where);
    this.loadingList = false;

    res.forEach(data => setListMap(this.list, POST_BY_SLUG, data, 'slug'));
  },
  async createPost(data) {
    const { slug } = data;

    this.loading[slug] = true;
    const res = await mutate(CREATE_POST, {
      variables: {
        data: pick({ ...DEFAULT_POST, ...data }, WRITABLE_FIELDS),
      },
      dataAccessor: 'createPost',
    });

    delete this.loading[slug];
    this.setLocalVersion(res);
    setListMap(this.list, POST_BY_SLUG, res, 'slug');
    return res;
  },
  async updatePost({ id, data }) {
    this.updating[id] = true;

    const res = await mutate(UPDATE_POST, {
      variables: {
        id,
        data: pick(data, WRITABLE_FIELDS),
      },
      dataAccessor: 'updatePostById',
    });

    delete this.updating[id];

    this.setLocalVersion(res);
    setListMap(this.list, POST_BY_SLUG, res, 'slug');
  },
  async deletePost(slug) {
    const { id } = POST_BY_SLUG[slug];

    this.deleting[slug] = true;
    await mutate(DELETE_POST, {
      variables: { id },
      dataAccessor: 'deletePostById',
    });
    delete this.deleting[slug];
    delListMap(this.list, POST_BY_SLUG, 'slug', slug);
  },
});
