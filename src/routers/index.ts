import { Router } from 'express';
import authRouter from './auth';
import gameRouter from './games';

export const ApiRouter = Router();

ApiRouter.use('/auth', authRouter);
ApiRouter.use('/games', gameRouter);
