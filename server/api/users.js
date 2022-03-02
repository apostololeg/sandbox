import jwt from 'jsonwebtoken';
import omit from 'lodash.omit';

import { JWT_SECRET, COOKIE_TOKEN_NAME } from '../../config/const';
import db from './db';

export function parseUserId(req) {
  const authToken = req.cookies[COOKIE_TOKEN_NAME];

  if (!authToken) return null;

  try {
    const { id } = jwt.verify(authToken, JWT_SECRET);
    return parseInt(id, 10);
  } catch (e) {
    return null;
  }
}

export function getCurrentUser(req, select) {
  const id = parseUserId(req);

  if (!id) return Promise.resolve(null);
  return db.user.findUnique({ where: { id }, select });
}

export async function createUser({ profile, isAdmin }) {
  const { email, password } = profile;
  console.log('=== createUser', profile);
  try {
    const data = {
      name: '',
      email,
      password,
      roles: [isAdmin ? 'ADMIN' : 'USER'],
    };
    console.log('> data', data);
    const newUser = await db.user.create({ data });
    console.log('> newUser', newUser);
    return { user: newUser };
  } catch (error) {
    console.log('> error', error);
    return { error: { ...error, message: 'Failed to create user' } };
  }
}
