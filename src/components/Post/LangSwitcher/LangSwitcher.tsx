import { useEffect } from 'react';
import cn from 'classnames';

import { Select } from 'uilib';
// import type { SelectProps } from 'uilib';

import { LANGS } from 'shared/langs';
import { usePosts } from 'store/posts';

import S from './LangSwitcher.styl';

type Props = {
  className?: string;
  postId: string | number;
  popupProps?: object; // SelectProps['popupProps'];
  showAllLangs?: boolean;
};

export default function LangSwitcher(props: Props) {
  const { className, postId, popupProps, showAllLangs } = props;

  const posts = usePosts(['byId', 'lang']);
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
}
