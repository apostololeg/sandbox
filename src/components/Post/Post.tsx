import { Fragment, useRef, useEffect, useMemo } from 'react';
import Time from 'timen';
import cn from 'classnames';

import { Link, Scroll, DateTime } from 'uilib';

import { getTextsFromData } from 'tools/posts';

import { PageLoader } from 'components/UI/Loader/Loader';

import { Title } from 'components/Header/Header';
import { hydrateComponents, PostRenderHelpers } from 'components/Editor/Editor';
import { useUser } from 'store/user';
import { usePosts } from 'store/posts';

import LangSwitcher from './LangSwitcher/LangSwitcher';

import S from './Post.styl';
import { Gap } from 'components/UI/Flex/Flex';
import { EmptyState } from 'components/UI/EmptyState/EmptyState';

type Props = {
  pathParams: { slug: string };
  preview?: boolean;
  className?: string;
};

export default function Post({ pathParams, preview, className }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const user = useUser(['isAdmin']);
  const posts = usePosts([
    'bySlug',
    'textsById',
    'localEdits',
    'loading',
    'lang',
  ]);

  const slug = pathParams.slug;

  const data = useMemo(() => {
    const { localEdits, bySlug } = posts;
    const remotePost = bySlug[slug];

    if (!remotePost) return null;

    const post = preview ? localEdits[remotePost.id] : remotePost;

    if (!post) return null;

    return post;
  }, [posts.bySlug, posts.localEdits, slug, preview]);

  const texts = useMemo(() => {
    if (!data) return null;
    const { lang, textsById } = posts;
    const { id } = getTextsFromData(data, lang);

    return textsById[id];
  }, [data, posts.lang, posts.textsById]);

  const isLoading = useMemo(() => {
    if (!data) return Boolean(posts.loading[slug]);

    return !texts;
  }, [data, texts, posts.loading, slug]);

  useEffect(() => {
    let clearHydrateTimer;

    async function init() {
      const { loadPost, loadCurrentTexts, bySlug } = posts;

      await loadPost(slug);
      if (bySlug[slug]) {
        await loadCurrentTexts(bySlug[slug].id);
      }

      if (texts) {
        clearHydrateTimer = Time.after(100, () =>
          hydrateComponents(container.current)
        );
      }
    }

    init();

    return () => {
      clearHydrateTimer?.();
    };
  }, [slug, preview, posts, texts]);

  function renderContent() {
    if (!data || !texts) return null;

    const { createdAt } = data;
    const { content } = texts;

    if (!content) return <EmptyState title="Empty" />;

    return (
      <Fragment>
        <Scroll y>
          <div
            className={S.content}
            ref={container}
            dangerouslySetInnerHTML={{ __html: content }} // eslint-disable-line
          />
        </Scroll>
        <Gap />
        <div className={S.footer}>
          {/* {author && (author.name || author.email)} */}
          {/* {new Date(createdAt).toString()} */}
          <LangSwitcher
            postId={data.id}
            popupProps={{ direction: 'right-top' }}
          />
          <Gap />
          <span className={S.date}>
            <DateTime value={createdAt} format="fromNow" />
          </span>
        </div>
      </Fragment>
    );
  }

  if (!data) return null;
  if (isLoading) return <PageLoader size="l" />;

  const { id } = data;

  return (
    <Fragment>
      <PostRenderHelpers />
      <Title text={texts?.title}>
        {user.isAdmin && [
          <Link href={`//post/${id}/edit`}>Edit</Link>,
          // preview && <Link href={`//post/${slug}`}>Original</Link>,
        ]}
        <Gap />
      </Title>
      <div className={cn(className, S.root)}>{renderContent()}</div>
    </Fragment>
  );
}
