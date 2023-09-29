import { Router } from 'express';
import authRouter from './auth';
import gameRouter from './games';
import userRouter from './user';
import gameHasUserRouter from './gameHasUser';

export const ApiRouter = Router();

ApiRouter.use('/auth', authRouter);
ApiRouter.use('/games', gameRouter);
ApiRouter.use('/user', userRouter);
ApiRouter.use('/gameHasUser', gameHasUserRouter);
