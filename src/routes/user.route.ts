import express from "express"
import { UserController } from "../controller/user.controller";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
// userRouter.get("/", userController.getAllUsers);
// userRouter.get("/:id", userController.getUserById);

// userRouter.put("/:id", userController.updateUser)
// userRouter.delete("/:id", userController.deleteUser)

export default userRouter;