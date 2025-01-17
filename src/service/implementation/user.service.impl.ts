
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { UserService } from "../user.service";
import { CustomError } from "../../utilis/customError";
import { db } from "../../config/db";
import { User } from "../../../node_modules/.prisma/client/default";
import { hashPassword } from "../../utilis/password.utils";
import { StatusCodes } from "../../../node_modules/http-status-codes/build/cjs/status-codes";
  


export class UserServiceImpl implements UserService{
    async profile(id: number): Promise<Omit<User, "password">> {
        const user = await db.user.findFirst({
            where: { id },
          });
      
          if (!user) {
            throw new CustomError(
              StatusCodes.NOT_FOUND,
              `user with id ${id} not found`
            );
          }
          return user;
    }
    
    
    async createUser(data: CreateUserDTO): Promise<User> {
        const isUserExist = await db.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if(isUserExist){
            throw new CustomError(409, "Oops email already taken");
        }

        const user = await db.user.create({
            data: {
                email: data.email,
                password:await hashPassword(data.password) ,
                firstName: data.firstname,
                lastName: data.lastname,
                role: data.role,
            },
        })
        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        return await db.user.findUnique({
            where: { id }
        })
    }

    async getAllUsers(): Promise<User[]> {
        return await db.user.findMany();
    }

    async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
        const isUserExists = await db.user.findFirst({
            where: { id, }
        });
        if (!isUserExists) {
            throw new CustomError(404, "There is no user with id: ${id}");
        }
        const user = await db.user.update({
            where: { id },
            data,
        });
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        await db.user.delete({
            where: { id },
        });
    }
    // async Profile(id:number): Promise<Omit<User,"password">>{
    //     const user = await db.user.findFirst({
    //         where:{
    //             id,
    //         },
    //     });

    //     if (user){
    //         throw new CustonError(
    //             StatusCodes.NOT_FOUND
    //             ``
    //         )
    //     }

    // }
}