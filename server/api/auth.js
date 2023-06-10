import jwt from 'jsonwebtoken';

import {
  PRODUCTION,
  JWT_SECRET,
  COOKIE_TOKEN_NAME,
  SESSION_EXPIRED_AFTER,
} from '../../config/const';
import { getCurrentUser } from '../api/users';
import { validateRole, ROLES } from '../permissions';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: PRODUCTION,
};

export const getToken = id =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: SESSION_EXPIRED_AFTER });

export const setCookie = (res, token) => {
  res.cookie(COOKIE_TOKEN_NAME, token, COOKIE_OPTS);
};

export const clearCookie = res => {
  res.clearCookie(COOKIE_TOKEN_NAME, COOKIE_OPTS);
};

export const validateUserRole = async (req, ...roles) => {
  const user = await getCurrentUser(req);
  return validateRole(user, ...roles);
};

export const adminMiddleware = (req, res, next) => {
  if (!validateUserRole(req, ROLES.ADMIN)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};

export const editorMiddleware = (req, res, next) => {
  if (!validateUserRole(req, ROLES.EDITOR)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
