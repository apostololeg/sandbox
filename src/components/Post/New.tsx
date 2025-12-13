import { useCallback, useEffect } from 'react';
import { useStore } from 'justorm/react';

import { PageLoader } from 'components/UI/Loader/Loader';
import { usePosts } from 'store/posts';

export default function PostNew() {
  const posts = usePosts([]);
  const { router, notifications } = useStore({ router: [], notifications: [] });

  const loadPost = useCallback(async () => {
    try {
      const data = await posts.createPost();
      router.replaceState(`/post/${data.id}/edit`);
    } catch (e: any) {
      notifications.show({
        type: 'error',
        title: 'Create post failed',
        content: e?.message,
      });
    }
  }, [posts, router, notifications]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return <PageLoader />;
}
