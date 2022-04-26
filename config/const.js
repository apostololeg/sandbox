const pick = require('lodash.pick');

const VARS = [
  'PEM_DIR',
  'PROTOCOL',
  'HOST',
  'PORT',
  'PAGE_LANG',
  'ADMIN_SECRET',
  'JWT_SECRET',
  'SESSION_EXPIRED_AFTER',
  'AWS_SECRET',
  'AWS_KEY_ID',
  'COOKIE_TOKEN_NAME',
  'DO_SPACE_NS',
  'DO_SPACE_NAME',
];

const { parsed } = require('dotenv').config();

const { NODE_ENV, NOMINIFY } = process.env;
const PRODUCTION = NODE_ENV === 'production';

const env = {
  PRODUCTION,
  NOMINIFY,
  ...pick(parsed, VARS),
};

if (!PRODUCTION) {
  Object.assign(env, {
    PROTOCOL: 'http://',
    HOST: 'localhost',
    PORT: ':3000',
  });
}

module.exports = env;
