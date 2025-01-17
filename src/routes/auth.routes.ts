import express from "express";
import { AuthController } from "../controller/auth.controller";

const authController = new AuthController();
const authRoutes = express.Router();

authRoutes.post("/", authController.login);

export default authRoutes;
