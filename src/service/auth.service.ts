import { User } from "../../node_modules/.prisma/client/index";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";


export interface AuthService {
    login(data: LoginDTO): Promise<{accessToken: string; refreshToken: string}>;
    // createUser(data: CreateUserDTO): Promise<User>
}
export interface AuthService {
    login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
    createUser(data: CreateUserDTO): Promise<User>;
    verifyEmail(data: VerifyEmailDTO): Promise<User>;
  
  }

