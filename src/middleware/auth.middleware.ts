import { NextFunction, Request, Response } from "express";
import  jwt, {JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "../../node_modules/http-status-codes/build/cjs/status-codes";
import { getReasonPhrase } from "../../node_modules/http-status-codes/build/cjs/utils-functions";



export interface CustomRequest extends Request{
    userAuth?:string;
}


export const aunthenticateUser =(
    req:CustomRequest,
    res:Response,
    next:NextFunction
): void =>{
    try{
        const authHeader =req?.headers["authorization"];

        if(!authHeader){
            res.status(StatusCodes.UNAUTHORIZED).json({
                message:"Authorization Required"
            });
            return;
        }
        const token = authHeader?.split (" ")[1];

        if(!token){
            res.status(StatusCodes.UNAUTHORIZED).json({
                message:"Token is missing from authorization header",
            })
        }

        jwt.verify(token,process.env.JWT_SECRET || " ",( err, decoded) =>{
            if(err){
                res.status(StatusCodes.FORBIDDEN).json({
                    message: "Invalid or expired token."
                })
            }

            const payload = decoded as JwtPayload;
            req.userAuth = payload.id;
            next()
        }
        )
    }catch(error: any){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            error: error.message
        })
    }
}
