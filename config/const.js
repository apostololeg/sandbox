module.exports = {
  PRODUCTION: process.env.NODE_ENV === 'production',
  NOMINIFY: Boolean(process.env.NOMINIFY),
  PROTOCOL: 'https://',
  HOST: 'apostol.space',
  PORT: '3000',
  PAGE_LANG: 'en',
  PAGE_TITLE: 'sandbox',
  STATS_PROJECT_ID: process.env.STATS_PROJECT_ID || 'cljww2icl0006ml74uwl0x0h2',
};
