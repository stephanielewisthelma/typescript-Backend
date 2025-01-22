import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class ResetPasswordDTO{
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