import jwt from 'jsonwebtoken';

import {
  PRODUCTION,
  JWT_SECRET,
  COOKIE_TOKEN_NAME,
  SESSION_EXPIRED_AFTER,
} from '../../config/const';

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
