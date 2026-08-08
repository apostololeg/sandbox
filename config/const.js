const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFile = path.resolve(__dirname, '../.env');
const sampleFile = path.resolve(__dirname, '../.env.sample');

const { parsed } = dotenv.config({
  path: fs.existsSync(envFile) ? envFile : sampleFile,
});

const env = parsed || {};

env.PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = env;
