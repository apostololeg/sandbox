import { DateTime, FormattedText, Scroll } from 'uilib';
import { Fragment, useEffect, useMemo } from 'react';

import { EmptyState } from 'components/UI/EmptyState/EmptyState';
import { PageLoader } from 'components/UI/Loader/Loader';
import S from './Post.styl';
import { Title } from 'components/Header/Header';
import cn from 'classnames';
import { usePosts } from 'store/posts';

type Props = {
  pathParams: { slug: string };
  className?: string;
};

function getText(data) {
  if (!data?.texts?.length) return null;
  return data.texts.find(t => t.lang === 'EN') ?? data.texts[0];
}

export default function Post({ pathParams, className }: Props) {
  const posts = usePosts(['bySlug', 'loading']);
  const slug = pathParams.slug;
  const data = posts.bySlug[slug];
  const texts = useMemo(() => getText(data), [data]);
  const isLoading = Boolean(posts.loading[slug]) || (!data && !texts);

  useEffect(() => {
    posts.loadPost(slug);
  }, [slug]);

  if (isLoading && !data) return <PageLoader size="l" />;
  if (!data) return <EmptyState title="Not found" />;

  return (
    <Fragment>
      <Title text={`~/${texts?.title || slug}`} />
      <div className={cn(className, S.root)}>
        {!texts?.content ? (
          <EmptyState title="Empty" />
        ) : (
          <Fragment>
            <Scroll
              y
              className={S.scroll}
              innerClassName={S.scrollInner}
              offset={{ y: { before: 74 } }}
              fadeSize="l"
            >
              <div className={S.content}>
                <FormattedText text={texts.content} />
              </div>
            </Scroll>
            <div className={S.footer}>
              <span className={S.date}>
                <DateTime value={data.createdAt} format="fromNow" />
              </span>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
