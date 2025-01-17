import { User } from "../../node_modules/.prisma/client/index";
// import { CreateUserDTO } from "../dto/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";


export interface AuthService {
    login(data: LoginDTO): Promise<{accessToken: string; refreshToken: string}>;
    // createUser(data: CreateUserDTO): Promise<User>
}


