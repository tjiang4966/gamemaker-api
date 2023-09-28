import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { DataSourceInstance } from './classes/DataConnection';
import { logger } from './helpers/logger';
import { setupSwagger } from './helpers/swagger';
import { ApiRouter } from './routers';
import { setupPassport } from './helpers/passport';
import { setupSession } from './helpers/mysqlSession';
import cors from 'cors';

dotenv.config();

const app = express();

/**
 * Middleware to parse incoming JSON request bodies
 */
app.use(bodyParser.json({limit: '25mb'}));

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Setup Swagger
 */
setupSwagger(app);

/**
 * Initialize data source instance
 */
DataSourceInstance.initialize().then(() => {
  logger.info('🍉[Database] Connection established');
});

/**
 * Setup MySql Session Config
 */
setupSession(app);

/**
 * Setup Passport.js
 */
setupPassport(app);

/**
 * Add Router
 */
app.use(ApiRouter)

/**
 * Error Handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err)
  res.status(500).send('Something went wrong!')
})

/**
 * Start API
 */
app.listen(process.env.PORT, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${process.env.PORT}`)
});