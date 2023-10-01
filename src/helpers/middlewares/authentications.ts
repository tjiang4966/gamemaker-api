import { NextFunction, Request, Response } from "express";
import * as JWT from 'jsonwebtoken';
import { IJwtBody } from "../../classes/IJwtBody";
import { logger } from "../logger";

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return next();
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Handle the case where no "Authorization" header is provided
    return res.status(401).json({ message: 'No JWT token provided' });
  }

  // Assuming the header format is "Bearer YOUR_JWT_TOKEN"
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    // Handle invalid "Authorization" header format
    return res.status(401).json({ message: 'Invalid JWT token format' });
  }
  // Now, 'token' contains the JWT token you can use
  JWT.verify(token, process.env.JWT_SECRET as string, { ignoreExpiration: false }, (err, body) => {
    logger.debug('[authentications.authenticateJWT] body: ', body);
    if (err) {
      if (err.name === 'TokenExpiredError'){
        return res.status(401).json({ message: 'Token has expired.'})
      }
      return next(err);
    }
    const { id, provider } = body as IJwtBody
    req.user = {
      id, provider,
    }
  });

  return next();
};

export const authenticateUserLogin = [
  authenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'You must login.' });
    }
    return next();
  },
];
