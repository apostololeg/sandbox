const { Router } = require('express');
const { listPosts, getPost } = require('../api/postsFromMd');

const router = Router();

router.get('/', (req, res) => {
  res.json(listPosts());
});

router.get('/:idOrSlug', (req, res) => {
  const data = getPost(req.params.idOrSlug);
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

module.exports = router;
