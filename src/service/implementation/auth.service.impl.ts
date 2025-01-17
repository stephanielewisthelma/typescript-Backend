import { LoginDTO } from "../../dtos/login.dto";
import { AuthService } from "../auth.service";
import Jwt  from "jsonwebtoken"
import { db } from "../../config/db";
import { comparePassword } from "../../utilis/password.utils";
import { CustomError } from "../../utilis/customError";


export class AuthServiceImpl implements AuthService{
    // createUser(data: CreateUserDTO): Promise<User> {
    //     throw new Error("Method not implemented.");
    // }
    // // requestPasswordReset(data: RequestResetPasswordDTO): Promise<void>

    async login(
        data: LoginDTO
    ): Promise<{accessToken: string; refreshToken: string}> {
        const user = await db.user.findUnique({
            where: {
                email: data.email,
        }
    });
        if(!user){
            throw new Error("User not found");
        }

        const ispasswordValid =await comparePassword(data.password, user.password)

        if(!ispasswordValid){
            throw new CustomError (401, "Invalid password or Email");
        }

        const fullName = user.firstName + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.id, fullName, user.role);

        const refreshToken = this.generateAccessToken(
            user.id,
            fullName,
            user.role
        )


        return {accessToken, refreshToken};
    }

    // async createUser(data: CreateUserDTO): Promise<User> {
    //     // const hashedPassword = hashPassword(data.password);
    //     return 
    // }

        generateAccessToken(userId: number, name: string, role:string): string {
            return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
                expiresIn: process.env.JWT_REFRESH_EXPIRES, 
            });
        }

        generateRefreshToken(userId: number, name: string, role: string): string{
            return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
                expiresIn: process.env.JWT_REFRESH_EXPIRES
            })
        }
    }

