'use strict';

import express, { Express, Router } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import expressFlash from 'express-flash';

function App(mainRouter: Router): Express {
  const app = express();
  app.use(logger('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: false }));
  app.use(expressFlash());
  app.use(cookieParser());

  app.use('/', mainRouter);

  return app;
}

export default App;
