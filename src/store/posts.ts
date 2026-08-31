import { createStore, useStore } from 'justorm/react';

import { api } from 'tools/request';

const STORE = createStore('posts', {
  items: [] as number[],
  byId: {} as Record<number, any>,
  bySlug: {} as Record<string, any>,
  loadingList: false,
  loading: {} as Record<string, boolean>,

  async loadPosts() {
    this.loadingList = true;
    try {
      const res = await api.get('/posts');
      (Array.isArray(res) ? res : []).forEach(data => setItem(data));
    } finally {
      this.loadingList = false;
    }
  },

  async loadPost(idOrSlug: string) {
    if (!idOrSlug || this.byId[idOrSlug] || this.bySlug[idOrSlug]) return;

    this.loading[idOrSlug] = true;
    try {
      const data = await api.get(`/posts/${idOrSlug}`);
      if (data) setItem(data);
    } finally {
      delete this.loading[idOrSlug];
    }
  },
});

function setItem(data) {
  if (!data?.id) return;
  STORE.byId[data.id] = data;
  if (data.slug) STORE.bySlug[data.slug] = data;
  if (!STORE.items.includes(data.id)) STORE.items.push(data.id);
}

export default STORE;
export type PostsStore = typeof STORE;

export const usePosts = (fields: (keyof PostsStore)[] = []) => {
  const store = useStore({ posts: fields });
  return store.posts;
};
