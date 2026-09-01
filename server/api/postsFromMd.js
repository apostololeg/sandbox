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

function loadMarkdownPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const filePath = path.join(POSTS_DIR, name);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = parseFrontmatter(raw);
      const slug = data.slug || name.replace(/\.md$/, '');
      const stat = fs.statSync(filePath);
      return {
        slug,
        title: data.title || slug,
        domain: data.domain || '',
        content,
        mtime: stat.mtime,
      };
    });
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
    texts: [{ id: 1, lang: 'EN', title: post.title, content: post.content }],
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
