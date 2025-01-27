import { IsNotEmpty, IsString, Length } from "class-validator";
export class ResetPasswordDTO {
    id!: Number

    @IsNotEmpty()
    @IsString()
    newPassword!: string
}



export class changePasswordDTO {
    @IsNotEmpty()
    @IsString()
    oldPassword!: string ;
    @IsNotEmpty()
    @IsString()
    @Length(5, 35)
    newPassword!: string;

}