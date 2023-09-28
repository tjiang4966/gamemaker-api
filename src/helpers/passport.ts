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
  callbackURL: '/auth/google/redirect',
}, async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyFunction
) => {
  // passport callback function
  try {
    const currentUser = await DataSourceInstance.manager.findOneBy(User, {googleId: profile.id});
    if (!currentUser) {
      // save new user
      logger.debug(`creating new user: googleId - ${profile.id}`)
      const newUser = await DataSourceInstance.getRepository(User).save({
        googleId: profile.id,
        displayName: profile.displayName,
        provider: profile.provider || '',
      });
      logger.debug(newUser);
      done(null, newUser);
    } else {
      logger.debug(`user exists: googleId - ${currentUser.googleId}`);
      done(null, currentUser);
    }
  } catch (err) {
    logger.error(err);
    done('Error', null);
  }
}));

passport.serializeUser((user, done) => {
  try {
    done(null, user);
  } catch (err) {
    logger.error(err);
    done('Failed to serializing user!', null);
  }
});

passport.deserializeUser<User>((user, done) =>{
  try {
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