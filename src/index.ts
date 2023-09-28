import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DataConnection } from './classes/DataConnection';
import { logger } from './helpers/logger';
import { setupSwagger } from './helpers/swagger';

dotenv.config();

const app = express();

/**
 * Middleware to parse incoming JSON request bodies
 */
app.use(bodyParser.json({limit: '25mb'}));

/**
 * Setup Swagger
 */
setupSwagger(app);

/**
 * Start API
 */
app.listen(process.env.PORT, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${process.env.PORT}`)
  /**
   * Initialize data source instance
   */
  DataConnection.getDataSource();
});