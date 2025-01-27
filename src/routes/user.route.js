"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const isAdmin_middleware_1 = require("../middleware/isAdmin.middleware");
const cloudinary_config_1 = require("../config/cloudinary.config");
const userController = new user_controller_1.UserController();
const userRouter = express_1.default.Router();
userRouter.post("/", userController.createUser);
userRouter.get("/auth/profile", auth_middleware_1.aunthenticateUser, userController.profile);
userRouter.get("/", auth_middleware_1.aunthenticateUser, isAdmin_middleware_1.isAdmin);
userRouter.get("/:id", auth_middleware_1.aunthenticateUser, userController.getUserById);
userRouter.patch("/:id", auth_middleware_1.aunthenticateUser, userController.updateUser);
userRouter.patch("/profile-pic", auth_middleware_1.aunthenticateUser, cloudinary_config_1.uploadToCloudinaryProfileImage, userController.updateProfilePic);
// userRouter.delete("/:id", aunthenticateUser, userController.deleteUser)
// userRouter.get("/", userController.getAllUsers);
// userRouter.get("/:id", userController.getUserById);
// userRouter.put("/:id", userController.updateUser)
// userRouter.delete("/:id", userController.deleteUser)
exports.default = userRouter;
