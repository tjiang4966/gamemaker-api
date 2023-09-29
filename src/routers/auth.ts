import { Router } from 'express';
import passport from 'passport';
import { logger } from '../helpers/logger';

const router = Router();
let target: string;

router.get('/success', passport.authenticate('google', {
  scope: ['profile']
}), (req, res, next) => {
  res.redirect(`http://localhost:5173/${target ?? ''}`);
  next();
});

router.get('/login/google', (req, res, next) => {
  logger.debug('target:', req.query.target);
  if (req.query.target) {
    target = req.query.target.toString();
  }
  next();
}, passport.authenticate('google', {
  scope: ['profile']
}));

export default router;
