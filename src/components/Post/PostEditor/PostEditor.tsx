import { Component } from 'react';
import { createStore, withStore } from 'justorm/react';
import compare from 'compareq';
import {
  Form,
  Spinner,
  Checkbox,
  Button,
  Link,
  debounce,
  array,
} from '@foreverido/uilib';

import { DEFAULT_LANG } from 'shared/langs';

import { getTextsFromData } from 'tools/posts';

import Flex from 'components/UI/Flex/Flex';
import { Title } from 'components/Header/Header';
import Editor from 'components/Editor/Editor';

import S from './PostEditor.styl';
import * as H from './PostEditor.helpers';
import { EmptyState } from 'components/UI/EmptyState/EmptyState';

import LangSwitcher from '../LangSwitcher/LangSwitcher';

type Props = {
  store?: any;
  id: string;
};

@withStore({
  posts: [
    'items',
    'textsById',
    'creatingTexts',
    'localEdits',
    'loading',
    'updating',
    'lang',
  ],
  notifications: [],
})
class PostEditor extends Component<Props> {
  store;
  form;
  editedLangs: string[] = [];

  validationSchema = {
    slug: { type: 'string' },
    slugLock: { type: 'boolean' },
    content: { type: 'string' },
    published: { type: 'boolean' },
  };

  constructor(props) {
    super(props);

    const postData = this.localVersion ?? this.remoteVersion ?? {};

    this.store = createStore(this, {
      showLocalVersion: Boolean(this.localVersion),
      initialValues: H.pickFormData(postData),
      isLoaded: false,
      isSaved: true,
      activeLang: DEFAULT_LANG,
    });

    this.onChange = debounce(this.onChange, 600);
  }

  componentDidMount() {
    this.editedLangs = [];
    this.loadPostData();

    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  isLoading() {
    const { id, store } = this.props;
    return Boolean(store.posts.loading[id]);
  }

  async loadPostData() {
    const { id, store } = this.props;
    const { loadPost, loadCurrentTexts } = store.posts;

    await loadPost(id);
    await loadCurrentTexts(id);

    this.store.isLoaded = true;

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
    const { id, store } = this.props;
    return store.posts.getLocalVersion(id);
  }

  get remoteVersion() {
    const { id, store } = this.props;
    const { byId, textsById } = store.posts;

    if (!byId[id]) return null;

    const data = { ...byId[id] };

    data.texts = data.texts.map(text => ({ ...text, ...textsById[text.id] }));

    return data;
  }

  getViewData() {
    if (this.store.showLocalVersion) return this.localVersion;
    return this.remoteVersion;
  }

  getActiveTexts(values = this.localVersion) {
    const { textsById, lang } = this.props.store.posts;
    const text = values.texts.find(item => item.lang === lang);

    if (!text) return null;

    return textsById[text.id];
  }

  createText = async () => {
    const { store, id } = this.props;
    const { createText } = store.posts;

    await createText(id);

    this.store.initialValues = H.pickFormData(this.remoteVersion);
  };

  updateActiveContent(content) {
    const { lang } = this.props.store.posts;
    const { slugLock } = this.form.values;

    const texts = [...this.form.values.texts];
    const index = array.indexWhere(texts, lang, 'lang');
    const title = H.parseTitleFromContent(content);

    texts[index] = { ...texts[index], content, title };

    this.form.setValue('texts', texts);

    if (lang === 'EN' && title && !slugLock) {
      this.form.setValue('slug', H.titleToSlug(title));
    }
  }

  updateLocalVersion() {
    const { setLocalVersion } = this.props.store.posts;

    setLocalVersion({ ...this.form.values });
  }

  onKeyDown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      e.stopPropagation();
      this.onSave();
    }
  };

  onLangChange = lang => (this.store.lang = lang);

  onChange = () => {
    this.updateLocalVersion();
    this.store.showLocalVersion = true;
    this.store.isSaved = false;
  };

  onEditorChange = (value: string) => {
    const { lang } = this.props.store.posts;
    const texts = this.getActiveTexts(this.form.values);

    if (texts.content === value) return;

    array.addUniq(this.editedLangs, lang);
    this.updateActiveContent(value);
    this.onChange();
  };

  onSave = async (values = this.form.values) => {
    const { store } = this.props;
    const { notifications, posts } = store;
    const { id } = this.localVersion;
    const data = { ...values };

    data.texts = data.texts.filter(
      ({ lang, title, content }) =>
        this.editedLangs.includes(lang) && (title || content)
    );

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
  };

  // toggleLocalVersion = () => {
  //   const { showLocalVersion } = this.store;

  //   this.store.showLocalVersion = !showLocalVersion;

  //   this.form.setValues(H.pickFormData(this.getViewData()));
  // };

  renderTitle() {
    const { lang } = this.props.store.posts;
    const postData = getTextsFromData(this.form.values, lang);

    if (this.isLoading() || !postData) return null;

    return (
      <Title text={postData.title || 'New post'} key="title">
        {this.renderTitleLinks(postData)}
      </Title>
    );
  }

  renderTitleLinks({ slug }) {
    const { isDirty } = this.form;

    if (!isDirty) return null;

    return [
      <Link href={`/post/${slug}/preview`} key="preview">
        Preview
      </Link>,
      <Link href={`/post/${slug}`} key="original">
        Original
      </Link>,
    ];
  }

  renderForm = form => {
    const { id, store } = this.props;
    const { updating, isTextCreating } = store.posts;
    const { showLocalVersion, isSaved } = this.store;
    const { isDirty, isValid, Field, values } = form;
    const texts = this.getActiveTexts(values);

    this.form = form;

    return [
      this.renderTitle(),

      <div className={S.slugWrap} key="slug-line">
        <Field name="slug" label="Slug" className={S.slug} key="slug" />
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

      texts ? (
        <Editor
          key="content"
          value={texts.content}
          onChange={this.onEditorChange}
          toolbarAddons={<LangSwitcher />}
        />
      ) : (
        <EmptyState title="There are no texts for this language">
          <LangSwitcher className={S.langSwitcherEmpty} />
          <Button onClick={this.createText} loading={isTextCreating(id)}>
            Create
          </Button>
        </EmptyState>
      ),

      <div className={S.footer} key="footer">
        <Field
          name="published"
          key="published"
          component={Checkbox}
          size="m"
          type="checkbox"
          label="Published"
        />
        <div className={S.gap} />
        {/* {!isSaved && (
          <Button
            className={S.versionButton}
            size="m"
            checked={showLocalVersion}
            disabled={!this.localVersion}
            onClick={this.toggleLocalVersion}
            key="localVersion"
          >
            Local version
          </Button>
        )} */}
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
    const { isLoaded, initialValues } = this.store;

    if (!isLoaded)
      return (
        <Flex centered>
          <Spinner size="l" />
        </Flex>
      );

    if (!initialValues) return <Flex centered>No post data.</Flex>;

    return (
      <Form
        className={S.root}
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
