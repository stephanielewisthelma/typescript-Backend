
import express from "express";
import passport from "../config/Oauth.config";
import { AuthController } from "../controller/auth.controller";
import { generateAccessToken, generateRefreshToken } from "../utilis/oauth.util";

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false }),
  function(req, res) {
    if (!req.user) {
      return res.redirect('/login');
    }
  
    const user = req.user as any;
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.redirect(`https://google.com?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });

export default authRouter;