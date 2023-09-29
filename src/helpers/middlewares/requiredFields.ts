import { NextFunction, Request, Response } from "express";

const requiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const actualFields = Object.keys(req.body);
      const missing: string[] = [];
      fields.forEach((field) => {
        if (!actualFields.includes(field) || req.body[field] === null || req.body === '' || req.body === undefined) {
          missing.push(field);
        }
      });
      if (missing.length) {
        return res.status(400).send(`Missing Fields: ${missing.join(',')}`);
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

export {requiredFields};