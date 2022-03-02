import { Router } from 'express';

import db from '../api/db';
import { getCurrentUser } from '../api/users';

const router = Router();

router
  .get('/', async (req, res) => {
    const items = await db.user.findMany(req.body);
    res.json(items);
  })
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const dataReq =
      id === 'me' ? getCurrentUser(req) : db.user.findUnique({ where: { id } });
    const data = await dataReq;

    res.json(data);
  });

export default router;
