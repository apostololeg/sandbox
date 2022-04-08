import { Router } from 'express';

import { validateRole, ROLES } from '../permissions';
import { getCurrentUser } from '../api/users';
import db from '../api/db';

const router = Router();

const validateUserRole = async (req, ...roles) => {
  const user = await getCurrentUser(req);
  return validateRole(user, ...roles);
};

const canEdit = req => validateUserRole(req, ROLES.EDITOR);
const canDelete = req => validateUserRole(req, ROLES.ADMIN);

router
  .get('/', async (req, res) => {
    const params = { where: {}, ...req.params };
    const allowEdit = await canEdit(req);

    if (!allowEdit) params.where.published = true;

    const items = await db.post.findMany(params);

    res.json(items);
  })
  .get('/:slug', async (req, res) => {
    const { slug } = req.params;
    const params = { where: { slug } };
    const allowEdit = await canEdit(req);

    if (!allowEdit) params.where = { AND: [{ slug }, { published: true }] };

    const data = await db.post.findFirst(params);

    res.json(data);
  })
  .post('/:id', async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const allowEdit = await canEdit(req);

    if (!allowEdit) {
      res.status(405).send();
      return;
    }

    try {
      const action =
        id === 'new'
          ? db.post.create({ data })
          : db.post.update({ where: { id: parseInt(id, 10) }, data });
      const post = await action;
      res.json(post);
    } catch (e) {
      res.status(400).send();
    }
  })
  .delete('/:id', async (req, res) => {
    const isAllowed = await canDelete(req);
    const status = isAllowed ? 200 : 405;

    res.status(status).send();
  });

export default router;
