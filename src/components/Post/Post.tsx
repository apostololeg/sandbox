import { Component, Fragment, createRef } from 'react';
import { withStore } from 'justorm/react';
import Time from 'timen';
import cn from 'classnames';

import { Link, Scroll, DateTime } from '@foreverido/uilib';

import { getTextsFromData } from 'tools/posts';

import { PageLoader } from 'components/UI/Loader/Loader';

import { Title } from 'components/Header/Header';
import { hydrateComponents, PostRenderHelpers } from 'components/Editor/Editor';

import LangSwitcher from './LangSwitcher/LangSwitcher';

import S from './Post.styl';
import { Gap } from 'components/UI/Flex/Flex';

type Props = {
  store?: any;
  slug: string;
  preview?: boolean;
  className?: string;
};

@withStore({
  user: ['isAdmin'],
  posts: ['bySlug', 'textsById', 'localEdits', 'loading', 'lang'],
})
class Post extends Component<Props> {
  container = createRef();

  clearHydrateTimer;

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    const { slug, preview } = this.props;
    const isSlugChanged = prevProps.slug !== slug;
    const isPreviewChanged = prevProps.preview !== preview;

    if (isSlugChanged || isPreviewChanged) {
      this.init();
    }
  }

  componentWillUnmount() {
    this.clearHydrateTimer?.();
  }

  async init() {
    const { slug, store } = this.props;
    const { loadPost, loadCurrentTexts, bySlug } = store.posts;

    await loadPost(slug);
    await loadCurrentTexts(bySlug[slug]?.id);

    if (this.texts) this.hydrate();
  }

  loadTexts() {
    const { slug, store } = this.props;
    const { bySlug, lang, loadTexts } = store.posts;
    const { id } = getTextsFromData(bySlug[slug], lang);

    loadTexts(id);
  }

  get isLoading() {
    const { slug, store } = this.props;

    if (!this.data) return store.posts.loading[slug];

    return !this.texts;
  }

  get data() {
    const { slug, preview, store } = this.props;
    const { localEdits, bySlug } = store.posts;
    const post = preview ? localEdits[slug] : bySlug[slug];

    if (!post) return null;

    return post;
  }

  get texts() {
    const { lang, textsById } = this.props.store.posts;
    const { id } = getTextsFromData(this.data, lang);

    return textsById[id];
  }

  hydrate() {
    this.clearHydrateTimer = Time.after(100, () =>
      hydrateComponents(this.container.current)
    );
  }

  renderContent() {
    const { createdAt } = this.data;

    if (!this.texts) return null;

    return (
      <Fragment>
        <Scroll y>
          <div
            className={S.content}
            ref={this.container}
            dangerouslySetInnerHTML={{ __html: this.texts.content }} // eslint-disable-line
          />
        </Scroll>
        <Gap />
        <div className={S.footer}>
          {/* {author && (author.name || author.email)} */}
          {/* {new Date(createdAt).toString()} */}
          <LangSwitcher
            postId={this.data.id}
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

  render() {
    if (!this.data) return null;
    if (this.isLoading) return <PageLoader size="l" />;

    const { className, preview, store } = this.props;
    const { user } = store;
    const { id, slug } = this.data;

    return (
      <Fragment>
        <PostRenderHelpers />
        <Title text={this.texts?.title}>
          {user.isAdmin && [
            <Link href={`/post/${id}/edit`}>Edit</Link>,
            preview && <Link href={`/post/${slug}`}>Original</Link>,
          ]}
          <Gap />
        </Title>
        <div className={cn(className, S.root)}>{this.renderContent()}</div>
      </Fragment>
    );
  }
}

export default Post;
