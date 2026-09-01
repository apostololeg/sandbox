require('dotenv').config();

const express = require('express');
const cors = require('cors');
const posts = require('./routes/posts');

const app = express();
const port = String(process.env.PORT || 3010).replace(/^:/, '');

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json({ limit: '2mb' }));
app.use('/api/posts', posts);

app.listen({ port }, () => {
  console.log(`\n  sandbox API ready on port ${port}\n`);
});
