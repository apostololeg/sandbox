const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.resolve(__dirname, '../../content/posts');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const data = {};
  match[1].split(/\r?\n/).forEach(line => {
    const i = line.indexOf(':');
    if (i < 1) return;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
  });

  return { data, content: match[2].trim() };
}

function slugId(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

// `<slug>.md` is the English post, `<slug>.<lang>.md` its translations
const FILE_NAME = /^(.+?)(?:\.([a-z]{2}))?\.md$/;

function loadMarkdownPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const bySlug = {};

  fs.readdirSync(POSTS_DIR)
    .filter(name => name.endsWith('.md'))
    .sort()
    .forEach(name => {
      const [, base, lang = 'en'] = name.match(FILE_NAME);
      const filePath = path.join(POSTS_DIR, name);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = parseFrontmatter(raw);
      const slug = data.slug || base;
      const stat = fs.statSync(filePath);
      if (!bySlug[slug]) {
        bySlug[slug] = { slug, texts: [], mtime: stat.mtime };
      }
      const post = bySlug[slug];

      if (lang === 'en') {
        post.title = data.title || slug;
        post.domain = data.domain || '';
      }
      if (stat.mtime > post.mtime) post.mtime = stat.mtime;
      const text = {
        lang: lang.toUpperCase(),
        title: data.title || slug,
        content,
      };
      if (lang === 'en') post.texts.unshift(text);
      else post.texts.push(text);
    });

  return Object.values(bySlug);
}

function toApiPost(post) {
  const iso = post.mtime.toISOString();
  return {
    id: slugId(post.slug),
    createdAt: iso,
    updatedAt: iso,
    slug: post.slug,
    tags: post.domain ? [post.domain] : [],
    published: true,
    texts: post.texts.map((text, i) => ({ id: i + 1, ...text })),
  };
}

function listPosts() {
  return loadMarkdownPosts()
    .map(toApiPost)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function getPost(idOrSlug) {
  const id = Number.parseInt(idOrSlug, 10);
  const byId = Number.isInteger(id) && String(id) === idOrSlug;
  return (
    listPosts().find(post =>
      byId ? post.id === id : post.slug === idOrSlug
    ) || null
  );
}

module.exports = {
  POSTS_DIR,
  parseFrontmatter,
  loadMarkdownPosts,
  listPosts,
  getPost,
};
