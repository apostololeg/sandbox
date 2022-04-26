import { useCallback, useEffect } from 'react';
import { withStore } from 'justorm/react';

import { PageLoader } from 'components/UI/Loader/Loader';

export default withStore({
  router: [],
  posts: [],
  notifications: [],
})(function PostNew({ router, store }) {
  const loadPost = useCallback(async () => {
    const { notifications, posts } = store;

    try {
      const data = await posts.createPost();
      router.replaceState(`/post/${data.id}/edit`);
    } catch (e) {
      notifications.show({
        type: 'error',
        title: 'Create post failed',
        content: e?.message,
      });
    }
  }, []);

  useEffect(() => {
    loadPost();
  }, []);

  return <PageLoader />;
});
