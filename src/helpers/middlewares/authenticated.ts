import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return next();
}