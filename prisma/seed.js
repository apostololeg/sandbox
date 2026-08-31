require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();
const POSTS_DIR = path.resolve(__dirname, '../content/posts');
const SEED_EMAIL = 'seed@apostol.space';

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

function loadPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, name), 'utf8');
      const { data, content } = parseFrontmatter(raw);
      const slug = data.slug || name.replace(/\.md$/, '');
      return {
        slug,
        title: data.title || slug,
        domain: data.domain || '',
        content,
      };
    });
}

async function ensureAuthor() {
  return db.user.upsert({
    where: { email: SEED_EMAIL },
    update: {},
    create: {
      name: 'Sandbox',
      email: SEED_EMAIL,
      password: 'seed',
      roles: ['EDITOR'],
    },
  });
}

async function upsertPost(authorId, post) {
  const existing = await db.post.findFirst({ where: { slug: post.slug } });
  const tags = post.domain ? [post.domain] : [];
  const text = { lang: 'EN', title: post.title, content: post.content };

  if (existing) {
    await db.post.update({
      where: { id: existing.id },
      data: {
        published: true,
        slugLock: true,
        tags,
        texts: {
          deleteMany: {},
          create: [text],
        },
      },
    });
    return { slug: post.slug, action: 'updated' };
  }

  await db.post.create({
    data: {
      slug: post.slug,
      slugLock: true,
      published: true,
      tags,
      author: { connect: { id: authorId } },
      texts: { create: [text] },
    },
  });
  return { slug: post.slug, action: 'created' };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const posts = loadPosts();
  if (!posts.length) {
    throw new Error(`No markdown posts in ${POSTS_DIR}`);
  }

  const author = await ensureAuthor();
  const results = [];
  for (const post of posts) {
    results.push(await upsertPost(author.id, post));
  }

  results.forEach(({ slug, action }) => {
    console.log(`${action} post /${slug}`);
  });
  console.log(`Seeded ${results.length} project posts`);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
