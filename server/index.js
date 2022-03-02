import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import historyApiFallback from 'connect-history-api-fallback-exclusions';
import cors from 'cors';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import { redirectToHTTPS } from 'express-http-to-https';

import paths from '../config/paths';
import { PRODUCTION, PORT, JWT_SECRET, PEM_DIR } from '../config/const';

import routes from './routes';

const app = express();

if (!PRODUCTION) {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({ secret: JWT_SECRET, resave: true, saveUninitialized: true }));

routes(app);

app.use(historyApiFallback({ exclusions: [/*'/passport/*', */ '/api/*'] }));

if (PRODUCTION) {
  app.use(express.static(paths.build));
  app.use(
    paths.build,
    expressStaticGzip(paths.build, {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      },
    })
  );

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(`${PEM_DIR}privkey.pem`, 'utf8'),
      cert: fs.readFileSync(`${PEM_DIR}cert.pem`, 'utf8'),
      ca: fs.readFileSync(`${PEM_DIR}chain.pem`, 'utf8'),
    },
    app
  );

  console.log('\n');
  httpServer.listen(80, () => console.log('HTTP 🚀 on port 80'));
  httpsServer.listen(443, () => console.log('HTTPS 🔐 on port 443'));
} else {
  const port = PORT.replace(/^:/, '');

  app.listen({ port }, () => {
    console.log(`\n  🚀  App ready on port ${port}\n`);
  });
}
