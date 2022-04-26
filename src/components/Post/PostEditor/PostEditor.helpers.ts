import pick from 'lodash.pick';

import { clone } from 'tools/object';

export function pickFormData(data) {
  return pick(clone(data), ['slug', 'slugLock', 'texts', 'published']);
}

export function titleToSlug(str) {
  const explicitSymbols = ['&nbsp;'];

  if (!str) return '';

  return str
    .replace(new RegExp(`(${explicitSymbols.join('|')})`), '')
    .match(/[\w\d_.-]+/g)
    .join('_')
    .toLowerCase();
}

export function parseTitleFromContent(content: string) {
  const h1 = content.replace(/(<br>|&nbsp;)/g, '').match('<h1.*?>(.*?)</h1>');
  return h1?.[1] || '';
}
