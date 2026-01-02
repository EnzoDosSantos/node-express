import { Router } from 'express';
import passport from 'passport';
import { authController } from './auth.controller';
import { authenticate } from './middleware/authenticate';

const router = Router();

router.post('/login', authController.login);

router.get('/profile', authenticate, authController.getProfile);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  authController.handleOAuthCallback('google')
);

router.get('/external/callback', (req, res) => {
  res.json({
    success: true,
    message: 'Use /auth/google/callback for OAuth',
    endpoints: {
      google: '/auth/google',
    },
  });
});

export default router;

