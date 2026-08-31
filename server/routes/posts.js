const { Router } = require('express');
const db = require('../api/db');

const router = Router();

const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
  tags: true,
  published: true,
  texts: { select: { id: true, lang: true, title: true, content: true } },
};

router.get('/', async (req, res) => {
  const items = await db.post.findMany({
    where: { published: true },
    select,
    orderBy: { updatedAt: 'desc' },
  });
  res.json(items);
});

router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  const id = Number.parseInt(idOrSlug, 10);
  const where =
    Number.isInteger(id) && String(id) === idOrSlug
      ? { id }
      : { slug: idOrSlug };

  const data = await db.post.findFirst({
    where: { AND: [where, { published: true }] },
    orderBy: { updatedAt: 'asc' },
    select,
  });

  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

module.exports = router;
