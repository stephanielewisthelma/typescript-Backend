import { Response, Request, NextFunction } from "express";
import { UserServiceImpl } from "../service/implementation/user.service.impl";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { StatusCodes } from "../../node_modules/http-status-codes/build/cjs/status-codes";
import { CustomRequest } from "../middleware/auth.middleware";

export class UserController {
  // getAllUsers: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

  private userService: UserServiceImpl;

  constructor() {
    this.userService = new UserServiceImpl();
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData = req.body as CreateUserDTO;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body as Partial<CreateUserDTO>;
      const updatedUser = await this.userService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public profile = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const id = req.userAuth;
      const user = await this.userService.getUserById(Number(id));

      res.status(StatusCodes.OK).json({
        error: false,
        message: "User profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
