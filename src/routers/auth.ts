import { Router } from 'express';
import passport from 'passport';
import { logger } from '../helpers/logger';
import * as JWT from 'jsonwebtoken';
import { IJwtBody } from '../classes/IJwtBody';
import { jwtSignOption } from '../config/config';
import { generateAccessToken } from '../helpers/utils/generateAccessToken';
import { User } from '../entities/User';

const router = Router();
let target: string;

router.get('/login/google/callback', passport.authenticate('google', {
  scope: ['profile']
}), (req, res, next) => {
  
  // need to store the authorization code somewhere

  // Sign JWT Token
  const accessToken = generateAccessToken(req.user as User);
  res.cookie('jwt', accessToken);
  res.redirect(`http://localhost:5173/${target ?? ''}`);
  next();
});

router.get('/login/google', (req, res, next) => {
  if (req.query.target) {
    target = req.query.target.toString();
  }
  next();
}, passport.authenticate('google', {
  scope: ['profile']
}));

export default router;
