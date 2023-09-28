import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/success', (req, res, next) => {
  res.send('successful authentication')
});

router.get('/login/google', passport.authenticate('google', {
  scope: ['profile']
}));

export default router;
