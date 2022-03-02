import { createStore } from 'justorm/react';

const Page = createStore('page', {
  title: 'Home',
  isAuth: false,
  setTitle(title) {
    const prevTitle = this.title;

    this.title = title;
    document.title = title;

    return prevTitle;
  },
});

export default Page;
