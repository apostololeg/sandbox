import { Router } from 'express';

import { validateRole, ROLES } from '../permissions';
import { getCurrentUser } from '../api/users';
import db from '../api/db';

const router = Router();

const canEdit = async (req) => {
  const user = await getCurrentUser(req);
  return validateRole(user, ROLES.EDITOR);
};

router
  .get('/', async (req, res) => {
    const params = { where: {}, ...req.params };
    const isEditor = await canEdit(req);

    if (!isEditor) params.where.published = true;

    const items = await db.post.findMany(params);

    res.json(items);
  })
  .get('/:id', async (req, res) => {
    const { slug } = req.params;
    const params = { where: { slug } };
    const isEditor = await canEdit(req);

    if (!isEditor) params.where = { AND: [{ slug }, { published: true }] };

    const data = await db.post.findFirst(params);

    res.json(data);
  })
  .post('/:id', async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const isEditor = await canEdit(req);

    console.log('create', id, data);

    if (!isEditor) {
      console.log('cant edit!');
      res.status(405);
      return;
    }

    try {
      const action =
        id === 'new'
          ? db.post.create({ data })
          : db.post.update({ where: { id: parseInt(id, 10) }, data });
      const post = await action;
      console.log('created', post);
      res.json(post);
    } catch (e) {
      console.log('ERROR', e);
      res.status(400).send();
    }
  });

export default router;
