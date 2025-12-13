import { DEFAULT_LANG } from 'shared/langs';

export function getTextsFromData(data, lang) {
  if (!data || !data.texts || !Array.isArray(data.texts)) {
    return { title: '', content: '' };
  }

  const textsByLang = data.texts.reduce(
    (acc, item) => ({ ...acc, [item.lang]: item }),
    {}
  );

  return (
    textsByLang[lang] ??
    textsByLang[DEFAULT_LANG] ??
    Object.values(textsByLang)[0]
  );
}
