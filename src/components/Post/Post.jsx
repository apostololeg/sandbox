import { Component, Fragment, createRef } from 'preact';
import { withStore } from 'justorm/preact';

import Time from 'timen';

import { Title } from 'components/Header';
import { hydrateComponents, PostRenderHelpers } from 'components/Editor';
import { Link } from 'components/Router';
import Flex, { mix as flex } from 'components/UI/Flex';
import Spinner from 'components/UI/Spinner';

import s from './Post.styl';

@withStore({
  user: ['isAdmin'],
  posts: ['list', 'localEdits', 'loading'],
})
class Post extends Component {
  container = createRef();

  isHydrated = false;

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
    } else if (!this.isHydrated && this.getData()) {
      this.hydrate();
    }
  }

  componentWillUnmount() {
    this.clearHydrateTimer?.();
  }

  isLoading() {
    const { slug, store } = this.props;
    return store.posts.loading[slug];
  }

  async init() {
    const { preview, slug, store } = this.props;
    const { getPostBySlug, getLocalVersion, loadPost } = store.posts;

    if (preview) {
      getLocalVersion(slug);
      this.hydrate();
      return;
    }

    if (getPostBySlug(slug)) {
      this.hydrate();
    } else {
      this.isHydrated = false;
      loadPost(slug);
    }
  }

  getData() {
    const { slug, preview, store } = this.props;
    const { localEdits, getPostBySlug } = store.posts;

    return preview ? localEdits[slug] : getPostBySlug(slug);
  }

  hydrate() {
    if (this.isHydrated) return;

    this.isHydrated = true;
    this.clearHydrateTimer = Time.after(100, () =>
      hydrateComponents(this.container.current)
    );
  }

  renderContent() {
    const { author, createdAt, content } = this.getData();

    return (
      <Fragment>
        <div
          ref={this.container}
          dangerouslySetInnerHTML={{ __html: content }} // eslint-disable-line
        />
        <div className={s.footer}>
          {author && (author.name || author.email)}
          {new Date(createdAt)}
        </div>
      </Fragment>
    );
  }

  render() {
    const data = this.getData();

    if (!data) return null;
    if (this.isLoading()) {
      return (
        <Flex>
          <Spinner />
        </Flex>
      );
    }

    const { className, slug, preview, store } = this.props;
    const { user } = store;

    return (
      <Fragment>
        <PostRenderHelpers />
        <Title text={data.title}>
          {user.isAdmin && [
            <Link href={`/posts/${slug}/edit`}>Edit</Link>,
            preview && <Link href={`/posts/${slug}`}>Original</Link>,
          ]}
        </Title>
        <div
          className={flex('scrolled', className, s.root)}
          onScroll={this.onScroll}
        >
          {this.renderContent(data)}
        </div>
      </Fragment>
    );
  }
}

export default Post;
