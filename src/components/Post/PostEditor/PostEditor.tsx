import { Component, memo } from 'react';
import { createStore, withStore } from 'justorm/react';
import { bind } from 'decko';
import nanoid from 'nanoid';
import compare from 'compareq';

import { Form, Spinner, Checkbox, Button, debounce } from 'uilib';

import Flex, { mix as flex } from 'components/UI/Flex/Flex';

import { Title } from 'components/Header/Header';
import { Link } from 'components/Router/Router';
import Editor from 'components/Editor/Editor';

import s from './PostEditor.styl';
import * as H from './PostEditor.helpers';

@withStore({
  posts: ['list', 'loading', 'updating'],
  user: [],
  notifications: [],
})
class PostEditor extends Component {
  store;

  validationSchema = {
    slug: { type: 'string' },
    content: { type: 'string' },
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
    if (this.props.slug) {
      this.loadPostData();
    } else {
      this.createNewPost();
    }

    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
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
        content: e.message,
      });
    }
  }

  updateLocalVersion(patch) {
    const { setLocalVersion } = this.props.store.posts;

    setLocalVersion({ ...this.getViewData(), ...patch });
  }

  @bind
  onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      e.stopPropagation();
      this.onSave();
    }
  }

  onChange(values) {
    this.updateLocalVersion(values);
    this.store.showLocalVersion = true;
    this.store.isSaved = false;
  }

  onEditorChange = (content) => {
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
  }

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
  }

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
      <Title text={postData.title || 'New post'}>
        {this.renderTitleLinks(showOriginal, postData)}
      </Title>
    );
  }

  renderTitleLinks(showOriginal, postData) {
    const { slug } = this.props;

    if (!showOriginal) return null;
    if (slug !== postData.slug) return '[Save new slug before preview]';
    return [
      <Link href={`/posts/${slug}/preview`}>Preview</Link>,
      <Link href={`/posts/${slug}`}>Original</Link>,
    ];
  }

  @bind
  renderForm(form) {
    const { isDirty, isValid, Field } = form;
    const { updating } = this.props.store.posts;
    const { showLocalVersion, isSaved } = this.store;

    this.form = form;

    return [
      this.renderTitle(isDirty),
      <div className={s.slugWrap}>
        <Field name="slug" className={s.slug} key="slug" />
        <Field
          name="slugLock"
          component={Checkbox}
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

      <div className={s.footer}>
        <Field
          name="published"
          component={Checkbox}
          type="checkbox"
          label="Published"
        />
        <div className={s.gap} />
        {!isSaved && (
          <Button
            className={s.versionButton}
            checked={showLocalVersion}
            disabled={!this.localVersion || !this.remoteVersion}
            onClick={this.toggleLocalVersion}
          >
            Local version
          </Button>
        )}
        <Button
          type="submit"
          loading={updating[(this.localVersion?.id)]}
          disabled={!isDirty || !isValid}
        >
          Save
        </Button>
      </div>,
    ];
  }

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
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onFormChange={this.onChange}
        onSubmit={this.onSave}
      >
        {this.renderForm}
      </Form>
    );
  }
}

export default memo(PostEditor);
