"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const client_1 = require("@prisma/client");
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const prisma = new client_1.PrismaClient();
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(new Error('Email not found for this account in Google'));
        }
        const user = yield prisma.user.findUnique({ where: { googleId: profile.id } });
        if (user) {
            return done(null, user);
        }
        const newUser = yield prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                googleId: profile.id,
                firstName: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName,
                lastName: (_c = profile.name) === null || _c === void 0 ? void 0 : _c.familyName,
                verifyEmail: true,
                email: email,
            }
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error);
    }
})));
exports.default = passport_1.default;
