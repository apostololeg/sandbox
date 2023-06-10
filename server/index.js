import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import cors from 'cors';
import compression from 'compression';

import { PRODUCTION, PORT, UPLOADS_DIR, JWT_SECRET } from '../config/const';

import routes from './routes';

const app = express();
const staticPath = path.resolve(__dirname, '../', UPLOADS_DIR);

console.log('staticPath', staticPath);

if (!PRODUCTION) {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // on production, nginx will serve the static files
  app.use(`/${UPLOADS_DIR}`, express.static(staticPath));
}

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(methodOverride());
app.use(session({ secret: JWT_SECRET, resave: true, saveUninitialized: true }));

routes(app);

const port = PORT.replace(/^:/, '');

app.listen({ port }, () => {
  console.log(`\n  🚀  App ready on port ${port}\n`);
});
