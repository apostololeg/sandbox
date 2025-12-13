import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useStore } from 'justorm/react';
import compare from 'compareq';
import { Form, Spinner, Checkbox, Button, Link, debounce, array } from 'uilib';

import { DEFAULT_LANG } from 'shared/langs';

import { getTextsFromData } from 'tools/posts';
import { usePosts } from 'store/posts';

import Flex from 'components/UI/Flex/Flex';
import { Title } from 'components/Header/Header';
import Editor from 'components/Editor/Editor';

import S from './PostEditor.styl';
import * as H from './PostEditor.helpers';
import { EmptyState } from 'components/UI/EmptyState/EmptyState';

import LangSwitcher from '../LangSwitcher/LangSwitcher';

type Props = {
  pathParams: { id: string };
};

export default function PostEditor({ pathParams }: Props) {
  const id = pathParams.id;
  const posts = usePosts([
    'items',
    'byId',
    'textsById',
    'creatingTexts',
    'localEdits',
    'loading',
    'updating',
    'lang',
  ]);
  const { notifications } = useStore({ notifications: [] });
  const formRef = useRef<any>(null);
  const editedLangsRef = useRef<string[]>([]);
  const prevLangRef = useRef<string | null>(null);

  const localVersion = useMemo(() => posts.getLocalVersion(id), [posts, id]);
  const remoteVersion = useMemo(() => {
    const { byId, textsById } = posts;
    const _data = byId[id];

    if (!_data) return null;

    const data = { ..._data };
    data.texts = data.texts.map(text => ({ ...text, ...textsById[text.id] }));

    return data;
  }, [posts.byId, posts.textsById, id]);

  const postData = useMemo(
    () => localVersion ?? remoteVersion ?? {},
    [localVersion, remoteVersion]
  );
  const hasLocalVersion = Boolean(localVersion);

  const [localState, setLocalState] = useState({
    showLocalVersion: hasLocalVersion,
    initialValues: H.pickFormData(postData),
    isLoaded: false,
    isSaved: !hasLocalVersion,
    activeLang: DEFAULT_LANG,
  });

  const validationSchema = {
    slug: { type: 'string' },
    slugLock: { type: 'boolean' },
    published: { type: 'boolean' },
  };

  const isLoading = useMemo(
    () => Boolean(posts.loading[id]),
    [posts.loading, id]
  );

  const viewData = useMemo(() => {
    if (localState.showLocalVersion) return localVersion;
    return remoteVersion;
  }, [localState.showLocalVersion, localVersion, remoteVersion]);

  const getContent = useCallback(() => {
    const { textsById, lang } = posts;
    const values = localState.showLocalVersion
      ? localVersion
      : formRef.current?.values;
    if (!values) return '';
    const text = values.texts?.find((item: any) => item.lang === lang);
    if (!text) return '';
    const { id: textId, content } = text;
    return content ?? textsById[textId]?.content ?? '';
  }, [posts, localState.showLocalVersion, localVersion]);

  const handleSave = useCallback(
    async (values?: any) => {
      if (!formRef.current) return;
      const formValues = values || formRef.current.values;
      const { id: postId } = localVersion;
      const data = { ...formValues };

      data.texts = data.texts.filter(
        ({ lang, title, content }: any) =>
          editedLangsRef.current.includes(lang) && (title || content)
      );

      await posts.updatePost({ id: postId, data });

      notifications.show({
        type: 'success',
        title: 'Post updated',
      });

      setLocalState(prev => ({
        ...prev,
        initialValues: H.pickFormData(remoteVersion),
        showLocalVersion: false,
        isSaved: true,
      }));
    },
    [localVersion, posts, notifications, remoteVersion]
  );

  useEffect(() => {
    editedLangsRef.current = [];

    async function loadPostData() {
      const { loadPost, loadCurrentTexts, byId } = posts;
      await loadPost(id);
      if (byId[id]) {
        await loadCurrentTexts(id);
      }

      const formData = H.pickFormData(remoteVersion);
      setLocalState(prev => ({
        ...prev,
        isLoaded: true,
        initialValues: formData,
        isSaved: compare(localVersion, remoteVersion),
      }));
    }

    loadPostData();

    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        e.stopPropagation();
        handleSave();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [id, posts, remoteVersion, localVersion, handleSave]);

  useEffect(() => {
    if (prevLangRef.current !== posts.lang) {
      prevLangRef.current = posts.lang;
      setLocalState(prev => ({
        ...prev,
        initialValues: H.pickFormData(viewData),
      }));
    }
  }, [posts.lang, viewData]);

  const updateLocalVersion = useCallback(() => {
    if (!formRef.current) return;
    const { setLocalVersion, localEdits } = posts;
    const prevData = localEdits[id]?.originalObject;
    setLocalVersion({ ...prevData, ...formRef.current.values });
  }, [posts, id]);

  const debouncedOnChange = useMemo(
    () =>
      debounce(() => {
        updateLocalVersion();
        setLocalState(prev => ({
          ...prev,
          showLocalVersion: true,
          isSaved: false,
        }));
      }, 600),
    [updateLocalVersion]
  );

  const updateActiveContent = useCallback(
    (content: string) => {
      if (!formRef.current) return;
      const { lang } = posts;
      const { slugLock } = formRef.current.values;
      const texts = [...formRef.current.values.texts];
      const index = array.indexWhere(texts, lang, 'lang');
      const title = H.parseTitleFromContent(content);

      texts[index] = { ...texts[index], content, title };
      formRef.current.setValue('texts', texts);

      if (lang === 'EN' && title && !slugLock) {
        formRef.current.setValue('slug', H.titleToSlug(title));
      }
    },
    [posts]
  );

  const handleEditorChange = useCallback(
    (value: string) => {
      const content = getContent();
      if (content === value) return;

      array.addUniq(editedLangsRef.current, posts.lang);
      updateActiveContent(value);
      debouncedOnChange();
    },
    [getContent, posts.lang, updateActiveContent, debouncedOnChange]
  );

  const createText = useCallback(async () => {
    await posts.createText(id);
    setLocalState(prev => ({
      ...prev,
      initialValues: H.pickFormData(remoteVersion),
    }));
  }, [posts, id, remoteVersion]);

  function renderTitle() {
    if (!formRef.current) return null;
    const { lang } = posts;
    const postData = getTextsFromData(formRef.current.values, lang);

    if (isLoading || !postData) return null;

    return (
      <Title text={postData.title || 'New post'} key="title">
        {renderTitleLinks()}
      </Title>
    );
  }

  function renderTitleLinks() {
    if (!formRef.current) return null;
    const { isDirty } = formRef.current;

    if (!isDirty) return null;

    return [
      <Link href={`//post/${remoteVersion?.slug}`} key="original">
        Original
      </Link>,
    ];
  }

  function renderForm(form: any) {
    formRef.current = form;
    const { updating, isTextCreating } = posts;
    const { showLocalVersion } = localState;
    const { isDirty, isValid, Field, values } = form;
    const content = getContent();

    return [
      renderTitle(),

      <div className={S.slugWrap} key="slug-line">
        <Field
          name="slug"
          label="Slug"
          className={S.slug}
          key="slug"
          onInput={() => form.setValue('slugLock', true)}
        />
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

      typeof content === 'string' ? (
        <Editor
          key="content"
          value={content}
          onChange={handleEditorChange}
          toolbarAddons={<LangSwitcher postId={id} showAllLangs />}
        />
      ) : (
        <EmptyState title="There are no texts for this language" key="empty">
          <LangSwitcher
            showAllLangs
            postId={id}
            className={S.langSwitcherEmpty}
          />
          <Button onClick={createText} loading={isTextCreating(id)}>
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
        <Button
          size="m"
          key="submit"
          type="submit"
          loading={updating[localVersion?.id]}
          disabled={!isDirty || !isValid}
        >
          Save
        </Button>
      </div>,
    ];
  }

  if (!localState.isLoaded) {
    return (
      <Flex centered>
        <Spinner size="l" />
      </Flex>
    );
  }

  if (!localState.initialValues) return <Flex centered>No post data.</Flex>;

  return (
    <Form
      className={S.root}
      initialValues={localState.initialValues}
      validationSchema={validationSchema}
      onChange={debouncedOnChange}
      onSubmit={handleSave}
    >
      {renderForm}
    </Form>
  );
}
