import { Component } from 'react';
import { createStore, withStore } from 'justorm/react';
import { nanoid } from 'nanoid';
import compare from 'compareq';

import { Form, Spinner, Checkbox, Button, Link, debounce } from 'uilib';

import Flex, { mix as flex } from 'components/UI/Flex/Flex';

import { Title } from 'components/Header/Header';
import Editor from 'components/Editor/Editor';

import s from './PostEditor.styl';
import * as H from './PostEditor.helpers';

type Props = {
  store?: any;
  router?: any;
  slug: string;
};

@withStore({
  posts: ['list', 'loading', 'updating'],
  user: [],
  notifications: [],
})
class PostEditor extends Component<Props> {
  store;
  form;

  validationSchema = {
    slug: { type: 'string' },
    slugLock: { type: 'boolean' },
    content: { type: 'string' },
    published: { type: 'boolean' },
  };

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      showLocalVersion: Boolean(this.localVersion),
      initialValues: H.pickFormData(this.localVersion || this.remoteVersion),
      isSaved: true,
    });

    this.onChange = debounce(this.onChange, 600);
  }

  componentDidMount() {
    console.log('Editor mount');

    if (this.props.slug) {
      this.loadPostData();
    } else {
      this.createNewPost();
    }

    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    console.log('Editor UNmount');

    document.removeEventListener('keydown', this.onKeyDown);
  }

  isLoading() {
    const { slug, store } = this.props;
    return Boolean(store.posts.loading[slug]);
  }

  async loadPostData() {
    const { slug, store } = this.props;

    await store.posts.loadPost(slug);
    const formData = H.pickFormData(this.remoteVersion);
    this.store.initialValues = formData;

    if (!compare(this.localVersion, this.remoteVersion)) {
      this.store.isSaved = false;
    }

    if (!this.store.showLocalVersion) {
      this.form.setValues(formData);
    }
  }

  get localVersion() {
    const { slug, store } = this.props;
    return store.posts.getLocalVersion(slug);
  }

  get remoteVersion() {
    const { slug, store } = this.props;
    return store.posts.getPostBySlug(slug);
  }

  getViewData() {
    if (this.store.showLocalVersion) return this.localVersion;
    return this.remoteVersion;
  }

  createNewPost = async () => {
    const { router, store } = this.props;
    const { user, notifications, posts } = store;

    try {
      const data = await posts.createPost({
        slug: nanoid(),
        author: H.connectAuthor(user.email),
        content: 'start writing here...',
      });
      router.navigate(`/posts/${data.slug}/edit`, { replace: true });
    } catch (e) {
      notifications.show({
        type: 'error',
        title: 'Create post failed',
        content: e?.message,
      });
    }
  };

  updateLocalVersion(patch) {
    const { setLocalVersion } = this.props.store.posts;

    setLocalVersion({ ...this.getViewData(), ...patch });
  }

  onKeyDown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      e.stopPropagation();
      this.onSave();
    }
  };

  onChange = values => {
    this.updateLocalVersion(values);
    this.store.showLocalVersion = true;
    this.store.isSaved = false;
  };

  onEditorChange = content => {
    const title = H.parseTitleFromContent(content);
    const { values } = this.form;

    if (values.content === content) {
      return;
    }

    if (this.localVersion.title && !values.slugLock) {
      this.form.setValue('slug', H.titleToSlug(title));
    }

    this.updateLocalVersion({
      title,
      content,
    });
  };

  onSave = async (values = this.form.values) => {
    const { router, store } = this.props;
    const { user, notifications, posts } = store;
    const { slug } = values;
    const { id, title } = this.localVersion;
    const data = {
      ...values,
      title,
      author: H.connectAuthor(user.email),
    };

    await posts.updatePost({ id, data });

    notifications.show({
      type: 'success',
      title: 'Post updated',
    });

    Object.assign(this.store, {
      initialValues: H.pickFormData(this.remoteVersion),
      showLocalVersion: false,
      isSaved: true,
    });

    if (slug !== this.props.slug) {
      router.replaceState(`/posts/${slug}/edit`, { quiet: true });
    }
  };

  toggleLocalVersion = () => {
    this.store.showLocalVersion = !this.store.showLocalVersion;
    this.form.setValues(H.pickFormData(this.getViewData()));
  };

  renderTitle(showOriginal) {
    const postData = this.getViewData();

    if (this.isLoading() || !postData) {
      return null;
    }

    return (
      <Title text={postData.title || 'New post'} key="title">
        {this.renderTitleLinks(showOriginal, postData)}
      </Title>
    );
  }

  renderTitleLinks(showOriginal, postData) {
    const { slug } = this.props;

    if (!showOriginal) return null;
    if (slug !== postData.slug) return '[Save new slug before preview]';
    return [
      <Link href={`/posts/${slug}/preview`} key="preview">
        Preview
      </Link>,
      <Link href={`/posts/${slug}`} key="original">
        Original
      </Link>,
    ];
  }

  renderForm = form => {
    const { isDirty, isValid, Field } = form;
    const { updating } = this.props.store.posts;
    const { showLocalVersion, isSaved } = this.store;

    this.form = form;

    return [
      this.renderTitle(isDirty),
      <div className={s.slugWrap} key="slug-line">
        <Field name="slug" className={s.slug} key="slug" />
        <Field
          name="slugLock"
          key="slugLock"
          component={Checkbox}
          size="m"
          type="checkbox"
          label="lock"
          clearMargins
        />
      </div>,

      <Field
        className={flex('scrolled')}
        name="content"
        component={Editor}
        onChange={this.onEditorChange}
        key="content"
      />,

      <div className={s.footer} key="footer">
        <Field
          name="published"
          key="published"
          component={Checkbox}
          size="m"
          type="checkbox"
          label="Published"
        />
        <div className={s.gap} />
        {!isSaved && (
          <Button
            className={s.versionButton}
            size="m"
            checked={showLocalVersion}
            disabled={!this.localVersion || !this.remoteVersion}
            onClick={this.toggleLocalVersion}
            key="localVersion"
          >
            Local version
          </Button>
        )}
        <Button
          size="m"
          key="submit"
          type="submit"
          isLoading={updating[this.localVersion?.id]}
          disabled={!isDirty || !isValid}
        >
          Save
        </Button>
      </div>,
    ];
  };

  render() {
    const { initialValues } = this.store;

    if (this.isLoading())
      return (
        <Flex centered>
          <Spinner size="l" />
        </Flex>
      );

    if (!initialValues) return <Flex centered>No post data.</Flex>;

    return (
      <Form
        className={flex()}
        initialValues={initialValues.originalObject}
        validationSchema={this.validationSchema}
        onChange={this.onChange}
        onSubmit={this.onSave}
      >
        {this.renderForm}
      </Form>
    );
  }
}

export default PostEditor;
