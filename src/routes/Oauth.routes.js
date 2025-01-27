"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Oauth_config_1 = __importDefault(require("../config/Oauth.config"));
const auth_controller_1 = require("../controller/auth.controller");
const oauth_util_1 = require("../utilis/oauth.util");
const authController = new auth_controller_1.AuthController();
const authRouter = express_1.default.Router();
authRouter.post("/login", authController.login);
authRouter.get('/google', Oauth_config_1.default.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', Oauth_config_1.default.authenticate('google', { session: false }), function (req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }
    const user = req.user;
    const accessToken = (0, oauth_util_1.generateAccessToken)(user.id, user.role);
    const refreshToken = (0, oauth_util_1.generateRefreshToken)(user.id, user.role);
    res.redirect(`https://google.com?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});
exports.default = authRouter;
