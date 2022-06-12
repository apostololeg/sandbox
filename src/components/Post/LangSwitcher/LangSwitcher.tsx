import { useCallback, useEffect } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import { Select } from 'uilib';
// import type { SelectProps } from 'uilib';

import { LANGS } from 'shared/langs';

import S from './LangSwitcher.styl';

type Props = {
  className?: string;
  store?: any;
  postId: string | number;
  popupProps?: object; // SelectProps['popupProps'];
  showAllLangs?: boolean;
};

export default withStore({
  posts: ['byId', 'lang'],
})(function LangSwitcher(props: Props) {
  const {
    className,
    postId,
    store: { posts },
    popupProps,
    showAllLangs,
  } = props;

  const { byId, lang } = posts;
  const data = byId[postId];
  const isVisible = showAllLangs || data?.texts.length > 1;
  const noCurrentLangTexts =
    !showAllLangs && data && !data.texts.some(t => t.lang === lang);

  useEffect(() => {
    if (isVisible && noCurrentLangTexts) {
      posts.setLang(data.texts[0].lang); // set first available lang
    }
  }, [noCurrentLangTexts]);

  if (!isVisible) return null;

  const onChange = val => {
    if (val) posts.setLang(val, postId);
  };

  const options =
    !showAllLangs && data
      ? data.texts.map(t => ({ id: t.lang, label: t.lang }))
      : LANGS.map(id => ({ id, label: id }));

  return (
    <Select
      className={cn(S.root, className)}
      label="Language"
      options={options}
      value={lang}
      required
      hideRequiredStar
      onChange={onChange}
      popupProps={popupProps}
    />
  );
});
