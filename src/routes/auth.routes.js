"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const authController = new auth_controller_1.AuthController();
const authRoutes = express_1.default.Router();
authRoutes.post("/", authController.login);
authRoutes.post("/", authController.login);
authRoutes.post("/sign-up", authController.createUser);
authRoutes.post("/verify-email", authController.VerifyEmailDTO);
exports.default = authRoutes;
