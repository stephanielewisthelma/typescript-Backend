import { LoginDTO } from "../../dtos/login.dto";
import { AuthService } from "../auth.service";
import { db } from "../../config/db";
import { comparePassword } from "../../utilis/password.utils";
import { CustomError } from "../../utilis/customError";
import { generateAccessToken, generateRefreshToken } from "../../utilis/oauth.util";
import { CreateUserDTO } from "../../dtos/createUser.dto";
import { VerifyEmailDTO } from "../../dtos/verifyEmail.dto";
import { generateOtp } from "../../utilis/otp.utils";
import { hashPassword } from "../../utilis/password.utils";
import { StatusCodes } from "http-status-codes";
import { sendOtpEmail, welcomeEmail } from "../../tsxFiles/email";
import { User } from "@prisma/client";

export class AuthServiceImpl implements AuthService {
    async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await db.user.findUnique({
            where: {
                email: data.email,
            }
        });
        if (!user) {
            throw new CustomError(401, "User not found");
        }

        if (!user.password) {
            throw new CustomError(401, "Invalid password or Email");
        }

        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new CustomError(401, "Invalid password or Email");
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);
        return { accessToken, refreshToken };
    }

    async verifyEmail(data: VerifyEmailDTO): Promise<User> {
        const user = await db.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
        }
        if (user.verifyEmail) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
        }
        if (!user.otp || !user.otpExpires) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is not available for this user");
        }

        const isOtpValid = await comparePassword(data.otp, user.otp);
        if (!isOtpValid) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
        }

        const isExpiredOtp = Number (user.otpExpires) < Number (new Date());
        if (isExpiredOtp) {
            throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
        }

        const userReg = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                verifyEmail: true,
                otp: null,
                otpExpires: null,
            },
        });

        await welcomeEmail({
            to: userReg.email,
            subject: "Welcome to Futurerify",
            name: userReg.firstName + " " + userReg.lastName,
        });

        return userReg;
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        const otp = generateOtp();
        const isUserExist = await db.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if (isUserExist) {
            throw new CustomError(409, "Oops, email already taken");
        }

        const hashedOtp = await hashPassword(otp);
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await db.$transaction(async (transaction) => {
                    const user = await transaction.user.create({
                        data: {
                            email: data.email,
                            password: await hashPassword(data.password),
                            firstName: data.firstname,
                            lastName: data.lastname,
                            role: data.role,
                            otp: hashedOtp,
                            otpExpires: this.generateOtpExpiration().toString(),
                        },
                    });

                    await sendOtpEmail({
                        to: data.email,
                        subject: "Verify your email",
                        otp,
                    });
                    return user;
                });
            } catch (error) {
                console.warn(`Retry ${attempt} due to transaction failure: ${error}`);
                if (attempt === maxRetries) {
                    throw new CustomError(
                        StatusCodes.INTERNAL_SERVER_ERROR,
                        "Failed to create user after multiple retries"
                    );
                }
            }
        }
        throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Unexpected error during user creation"
        );
    }
    generateOtpExpiration() {
        return new Date(Date.now() + 10 * 60 * 1000)
    }
}
