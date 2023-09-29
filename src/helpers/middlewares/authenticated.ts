import { NextFunction, Request, Response } from "express";

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.sendStatus(401);
  }
  next();
}