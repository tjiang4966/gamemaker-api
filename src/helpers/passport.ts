import { OAuth2Strategy, Profile, VerifyFunction } from 'passport-google-oauth';
import passport from 'passport';
import dotenv from 'dotenv';
import { logger } from './logger';
import { User } from '../entities/User';
import { DataSourceInstance } from '../classes/DataConnection';
import { Application } from 'express';

dotenv.config();

passport.use(new OAuth2Strategy({
  // options for the google strategy
  clientID: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  callbackURL: '/auth/login/google/callback',
}, async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyFunction,
) => {
  // passport callback function
  try {
    const currentUser = await DataSourceInstance.manager.findOneBy(User, {googleId: profile.id});
    if (!currentUser) {
      // save new user
      const newUser = await DataSourceInstance.getRepository(User).save({
        googleId: profile.id,
        displayName: profile.displayName,
        provider: profile.provider || '',
      });
      done(null, newUser);
    } else {
      done(null, currentUser);
    }
  } catch (err) {
    logger.error(err);
    done('Error', null);
  }
}));

passport.serializeUser((user, done) => {
  try {
    logger.debug('Serializing User ...');
    done(null, user);
  } catch (err) {
    logger.error(err);
    done('Failed to serializing user!', null);
  }
});

passport.deserializeUser<User>((user, done) =>{
  try {
    logger.debug('Deserializing User ...');
    return done(null, user);
  } catch (err) {
    logger.error(err);
    done('Failed to deserializing user!', null);
  }
});

const setupPassport = (app: Application) => {
  logger.info('Initializing Passport ...');
  app.use(passport.authenticate('session'));
  app.use(passport.initialize());
  app.use(passport.session());
}

export {setupPassport};