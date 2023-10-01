import { Router } from 'express';
import passport from 'passport';
import { logger } from '../helpers/logger';
import * as JWT from 'jsonwebtoken';
import { IJwtBody } from '../classes/IJwtBody';

const router = Router();
let target: string;

router.get('/login/google/callback', passport.authenticate('google', {
  scope: ['profile']
}), (req, res, next) => {
  // need to store the authorization code somewhere
  const { id, provider } = req.user as IJwtBody; 
  const jwtToken = JWT.sign({ id, provider }, process.env.JWT_SECRET as string)
  res.cookie('jwt', jwtToken);
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
