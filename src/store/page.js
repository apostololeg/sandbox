import { store } from 'react-easy-state';

const Page = store({
  title: 'Home',
  isAuth: false,
});

export default Page;

export const setTitle = title => {
  Page.title = title;
  document.title = title;
};
