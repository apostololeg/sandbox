import { Router } from 'express';

import { getToken, setCookie, clearCookie } from '../api/auth';
import { createUser, getCurrentUser } from '../api/users';
import db from '../api/db';

const router = Router();

function authorize(res, user) {
  setCookie(res, getToken(user.id));
  res.status(200).json(user);
}

router
  .get('/me', async (req, res) => {
    const data = await getCurrentUser(req, {
      username: true,
      avatar: true,
      roles: true,
    });

    res.json(data);
  })
  .post('/register', async (req, res) => {
    const { user, error } = await createUser({ profile: req.body });

    if (error) {
      res.status(409).json(error);
      return;
    }

    authorize(res, user);
  })
  .post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.user.findFirst({
      where: {
        AND: [{ email }, { password }],
      },
    });

    if (!user) return res.status(403).json(null);

    authorize(res, user);
  })
  .get('/loginas/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const data = await db.user.findUnique({ where: { id } });

    setCookie(res, getToken(id));
    res.json(data);
  })
  .get('/logout', (req, res) => {
    clearCookie(res);
    res.redirect('/');
  });

export default router;
