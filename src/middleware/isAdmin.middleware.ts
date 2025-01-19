import { NextFunction } from "express";
import { CustomRequest } from "./auth.middleware";
import { db } from "../config/db";
import { CustomError } from "../utilis/customError";
import { StatusCodes } from "../../node_modules/http-status-codes/build/cjs/status-codes";
import { Role } from "../../node_modules/.prisma/client/index";
import { Response } from "express";


export const isAdmin = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const user = await db.user.findUnique({
               where: {
                id: Number(req.userAuth),
               }
            });
            if(!user){
                throw new CustomError(StatusCodes.NOT_FOUND, "User not found")
            }
            if(user.role === Role.ADMIN){
                next();
            }else{
                throw new CustomError(StatusCodes.FORBIDDEN, "Access denied")
            }
        }catch(error){
            next(error)
        }
    }

export default isAdmin;