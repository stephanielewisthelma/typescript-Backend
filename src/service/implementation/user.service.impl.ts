
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { UserService } from "../user.service";
import { CustomError } from "../../utilis/customError";
import { db } from "../../config/db";
import { User } from "../../../node_modules/.prisma/client/default";
import { comparePassword, hashPassword } from "../../utilis/password.utils";
import { StatusCodes } from "../../../node_modules/http-status-codes/build/cjs/status-codes";
import { changePasswordDTO } from "../../dtos/changePassword.dto";
import { ResetPasswordDTO } from "../../dtos/resetPassword.dto";
  


export class UserServiceImpl implements UserService{
    async setPassword(
        id: number, 
        data: changePasswordDTO
      ): Promise<void> {
         await db.$transaction(async (transaction) => {
         
        const user = await transaction.user.findUnique({
          where: {
            id
          }
        })
    
        if(!user){
          throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
        }
    
        const isPasswordValid = await comparePassword(
          data.oldPassword,
          user.password || ""
        )
    
        if(!isPasswordValid){
          throw new CustomError(400, "Current password is incorrect")
        }
    
        const previousPasswords = await transaction.passwordHistory.findMany({
          where: {
            userId: id
          },
          select: {
            passwordHash: true
          },
        })
        for(const history of previousPasswords){
             const isPreviouslyUsed = await comparePassword(
              data.newPassword,
              history.passwordHash
             );
    
             if(isPreviouslyUsed){
              throw new CustomError(
                400,
                "The New Password has been used before. Please choose a different password"
              )
             }
        }
    
        if(user.password){
          await transaction.passwordHistory.create({
            data: {
              userId: id,
              passwordHash: user.password
            }
          })
        }
    
        const hashedPassword = await hashPassword(data.newPassword);
    
        await transaction.user.update({
          where: { id },
          data: {
            password: hashedPassword
          },
        });
        
         })
      }
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

async updateProfilePic(
    id: number,
    data: { profilePic: string }
  ): Promise<Object | any> {
    const user = await db.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
    }
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: { profilePicture: data.profilePic },
    });

    //return updateuser without sensitive fileds like password
    return {
      id: updatedUser.id,
      name: updatedUser.firstName,
      email: updatedUser.email,
      profilePicture: updatedUser
    };
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