module.exports = {
  PRODUCTION: process.env.NODE_ENV === 'production',
  NOMINIFY: Boolean(process.env.NOMINIFY),
  PROTOCOL: 'https://',
  HOST: 'apostol.space',
  PORT: '3000',
  PAGE_LANG: 'en',
  PAGE_TITLE: 'sandbox',
};
