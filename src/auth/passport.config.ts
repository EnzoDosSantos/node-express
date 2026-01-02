import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authConfig } from '../config/auth.config';
import { usersStore } from './users.store';
import logger from '../utils/logger';

export function configurePassport(): void {
  if (authConfig.oauth.google.clientId) {
    passport.use(new GoogleStrategy(
      {
        clientID: authConfig.oauth.google.clientId,
        clientSecret: authConfig.oauth.google.clientSecret,
        callbackURL: authConfig.oauth.google.callbackUrl,
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || '';
          const name = profile.displayName || '';
          
          const user = usersStore.findOrCreateOAuthUser({ email, name, provider: 'google' });
          logger.info(`Google OAuth: ${email}`);
          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    ));
  }

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser((id: string, done) => {
    const user = usersStore.findById(id);
    done(null, user || null);
  });
}

