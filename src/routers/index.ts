import { Router } from 'express';
import authRouter from './auth';

export const ApiRouter = Router();

ApiRouter.use('/auth', authRouter);
