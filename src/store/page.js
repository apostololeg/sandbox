import { createStore, useStore } from 'justorm/react';

const STORE = createStore('page', {
  title: 'Home',
  setTitle(title) {
    const prevTitle = this.title;

    this.title = title;
    document.title = title;

    return prevTitle;
  },
});

export default STORE;

export const usePage = (fields = []) => {
  const store = useStore({ page: fields });
  return store.page;
};
