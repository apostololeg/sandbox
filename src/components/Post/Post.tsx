import { DateTime, FormattedText, Scroll } from 'uilib';
import { Fragment, useEffect, useMemo, useState } from 'react';

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

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;

type Part = { text: string } | { alt: string; src: string };

// FormattedText has no images, so standalone `![alt](src)` lines render as figures
function splitImages(content: string): Part[] {
  const parts: Part[] = [];
  let lines: string[] = [];
  const flush = () => {
    const text = lines.join('\n').trim();
    if (text) parts.push({ text });
    lines = [];
  };

  content.split('\n').forEach(line => {
    const match = line.trim().match(IMAGE_LINE);
    if (!match) {
      lines.push(line);
      return;
    }
    flush();
    parts.push({ alt: match[1], src: match[2] });
  });
  flush();

  return parts;
}

const RTL_LANGS = ['AR'];

// `?lang=de` wins, then the browser's languages, then English
function getPreferredLangs(): string[] {
  const query = new URLSearchParams(window.location.search).get('lang');
  const browser = navigator.languages ?? [navigator.language];
  return [query, ...browser]
    .filter(Boolean)
    .map(lang => lang.slice(0, 2).toUpperCase());
}

function getText(data, lang: string) {
  if (!data?.texts?.length) return null;
  const byLang = l => data.texts.find(t => t.lang === l);
  return (
    byLang(lang) ??
    getPreferredLangs().map(byLang).find(Boolean) ??
    byLang('EN') ??
    data.texts[0]
  );
}

function setLangParam(lang: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang.toLowerCase());
  window.history.replaceState(window.history.state, '', url);
}

export default function Post({ pathParams, className }: Props) {
  const posts = usePosts(['bySlug', 'loading']);
  const slug = pathParams.slug;
  const data = posts.bySlug[slug];
  const [lang, setLang] = useState<string>(null);
  const texts = useMemo(() => getText(data, lang), [data, lang]);
  const langs: string[] = data?.texts?.map(t => t.lang) ?? [];
  const parts = useMemo(
    () => (texts?.content ? splitImages(texts.content) : []),
    [texts]
  );
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
              <div
                className={S.content}
                lang={texts.lang.toLowerCase()}
                dir={RTL_LANGS.includes(texts.lang) ? 'rtl' : undefined}
              >
                {parts.map((part, i) =>
                  'src' in part ? (
                    <figure className={S.figure} key={i}>
                      <img src={part.src} alt={part.alt} loading="lazy" />
                      {part.alt && <figcaption>{part.alt}</figcaption>}
                    </figure>
                  ) : (
                    <FormattedText text={part.text} key={i} />
                  )
                )}
              </div>
            </Scroll>
            <div className={S.footer}>
              <span className={S.date}>
                <DateTime value={data.createdAt} format="fromNow" />
              </span>
              {langs.length > 1 && (
                <span className={S.langs}>
                  {langs.map(l => (
                    <button
                      key={l}
                      type="button"
                      className={cn(S.lang, l === texts.lang && S.langActive)}
                      onClick={() => {
                        setLang(l);
                        setLangParam(l);
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </span>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
