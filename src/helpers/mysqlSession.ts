import dotenv from 'dotenv';
import { Application } from 'express';
import MySQLStore from "express-mysql-session";
import * as expressSession from "express-session";
import { logger } from './logger';

dotenv.config();

const sessionStoreClass = MySQLStore(expressSession);

const mysqlSessionOptions = (): expressSession.SessionOptions => {
  const sessionStore = new sessionStoreClass({
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT ?? '', 10),
    user: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '',
  });
  const sessionConfig: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15, // 15 min
      secure: process.env.ENVIORNMENT === 'prod' ? true : false,
      httpOnly: process.env.ENVIORNMENT === 'prod' ? false : true,
    },
    store: sessionStore
  };
  return sessionConfig;
};

const setupSession = (app: Application) => {
  logger.info('Initializing Session ...');
  app.use(expressSession.default(mysqlSessionOptions()));
  process.nextTick(() => {
    logger.info('Session Initialized');
  })
}

export { setupSession };