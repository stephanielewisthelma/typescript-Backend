import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class ResetPasswordDTO{
    oldPassword(oldPassword: any, arg1: string) {
        throw new Error("Method not implemented.");
    }
    @IsString()
    @IsEmail()
    email!: string
  
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp!: string;
  
    @IsNotEmpty()
    @Length(6, 20)
    newPassword!: string
  }