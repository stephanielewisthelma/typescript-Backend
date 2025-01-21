import express from "express";
import { AuthController } from "../controller/auth.controller";

const authController = new AuthController();
const authRoutes = express.Router();

authRoutes.post("/", authController.login);

authRoutes.post("/", authController.login);

authRoutes.post(
  "/sign-up",
 
  authController.createUser
);

authRoutes.post(
  "/verify-email",
  authController.VerifyEmailDTO
);

export default authRoutes;
