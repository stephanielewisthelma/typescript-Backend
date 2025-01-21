import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import google from 'passport-google-oauth20';
import { Profile, VerifyCallback } from 'passport-google-oauth20'
import { Request } from 'express';

const prisma = new PrismaClient();
const GoogleStrategy = google.Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      const email = profile.emails?.[0].value;
      if (!email) {
        return done(new Error('Email not found for this account in Google'));
      }

      const user = await prisma.user.findUnique({ where: { googleId: profile.id } });
      if (user) {
        return done(null, user);
      }

      const newUser = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          googleId: profile.id,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          verifyEmail: true,
          email: email,
        }
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;