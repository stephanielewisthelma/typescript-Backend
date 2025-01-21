import { NextFunction, Response, Request } from "express";
import { LoginDTO } from "../dtos/login.dto";
// import { AuthService } from "../service/auth.service";
import { AuthServiceImpl } from "../service/implementation/auth.service.impl";
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";
import { CreateUserDTO } from "../dtos/createUser.dto";

export class AuthController {
  private authService: AuthServiceImpl;

  constructor() {
    this.authService = new AuthServiceImpl();
  }

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const { accessToken, refreshToken } = await this.authService.login(data);
      res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateUserDTO = req.body;
      const user = await this.authService.createUser(data);
      res.status(201).json({
        error: false,
        message: `Otp has been sent successfully to your email @ ${user.email}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public VerifyEmailDTO = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: VerifyEmailDTO = req.body;
      const user = await this.authService.verifyEmail(data);
      res.status(201).json({
        error: false,
        message: 'You have successfully registered',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
