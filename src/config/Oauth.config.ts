import passport from 'passport';
import { User } from '../../node_modules/.prisma/client/index';
import google from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { verify } from 'crypto';
import {Profile,VerifyCallback} from 'passport-google-oauth20'

const GoogleStrategy =google.Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,   // Assuming you load the Google Client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Similarly for Client Secret
    callbackURL: "http://www.example.com/auth/google/callback",
    passReqToCallback : true,
  },
  (accessToken: string, refreshToken: string, profile:Profile, done: VerifyCallback ) => {
    // Define your User.findOrCreate method to find or create a user based on the Google profile
   const prisma = new PrismaClient();
   const User = prisma.user.findOne({where :{googleId:profile.id}});
   if(User ){
    return cb(null, User);
   }
    prisma.user.upsert({
    where: {
      email: profile.emails,
    },
    update: {}, // Provide an empty update parameter
    create: {
      email: profile.emails,
      firstName:profile.name.givenName,
      lastName:profile.displayName,
      verifyEmail : true

    },
  })
  .then((user:User) => cb(null, user))
  .catch((err:any) => cb(err));

));
