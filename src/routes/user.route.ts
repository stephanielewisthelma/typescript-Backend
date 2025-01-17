import express from "express"
import { UserController } from "../controller/user.controller";
import { aunthenticateUser } from "../middleware/auth.middleware";
import {isAdmin} from "../middleware/isAdmin.middleware";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/auth/profile", aunthenticateUser, userController.profile)
userRouter.get("/", aunthenticateUser, isAdmin);
userRouter.get("/:id", aunthenticateUser, userController.getUserById);

userRouter.patch("/:id", aunthenticateUser, userController.updateUser)
// userRouter.delete("/:id", aunthenticateUser, userController.deleteUser)

// userRouter.get("/", userController.getAllUsers);
// userRouter.get("/:id", userController.getUserById);

// userRouter.put("/:id", userController.updateUser)
// userRouter.delete("/:id", userController.deleteUser)

export default userRouter;