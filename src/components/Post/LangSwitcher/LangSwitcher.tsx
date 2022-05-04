import { useCallback, useEffect } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import { Select } from '@foreverido/uilib';
// import type { SelectProps } from '@foreverido/uilib';

import { LANGS } from 'shared/langs';

import S from './LangSwitcher.styl';

type Props = {
  className?: string;
  store?: any;
  postId: string | number;
  popupProps?: object; // SelectProps['popupProps'];
};

export default withStore({
  posts: ['byId', 'lang'],
})(function LangSwitcher(props: Props) {
  const {
    className,
    postId,
    store: { posts },
    popupProps,
  } = props;
  const { lang, byId } = posts;
  const data = byId[postId];
  const isVisible = !data || data.texts.length > 1;

  const onChange = useCallback(
    val => {
      if (!val) return;
      posts.setLang(val, postId);
    },
    [postId]
  );

  useEffect(() => {
    if (isVisible) {
      if (data && !data.texts.find(t => t.lang === lang)) {
        posts.setLang(data.texts[0].lang, postId);
      }
    }
  }, [postId]);

  if (!isVisible) return null;

  const options = data
    ? data.texts.map(t => ({ id: t.lang, label: t.lang }))
    : LANGS.map(id => ({ id, label: id }));

  return (
    <Select
      className={cn(S.root, className)}
      label="Language"
      options={options}
      value={lang}
      onChange={onChange}
      popupProps={popupProps}
    />
  );
});
