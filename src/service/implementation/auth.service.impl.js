"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImpl = void 0;
const db_1 = require("../../config/db");
const password_utils_1 = require("../../utilis/password.utils");
const customError_1 = require("../../utilis/customError");
const oauth_util_1 = require("../../utilis/oauth.util");
const otp_utils_1 = require("../../utilis/otp.utils");
const password_utils_2 = require("../../utilis/password.utils");
const http_status_codes_1 = require("http-status-codes");
const email_1 = require("../../tsxFiles/email");
class AuthServiceImpl {
    resetPassword(data) {
        throw new Error("Method not implemented.");
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findUnique({
                where: {
                    email: data.email,
                }
            });
            if (!user) {
                throw new customError_1.CustomError(401, "User not found");
            }
            if (!user.password) {
                throw new customError_1.CustomError(401, "Invalid password or Email");
            }
            const isPasswordValid = yield (0, password_utils_1.comparePassword)(data.password, user.password);
            if (!isPasswordValid) {
                throw new customError_1.CustomError(401, "Invalid password or Email");
            }
            const accessToken = (0, oauth_util_1.generateAccessToken)(user.id, user.role);
            const refreshToken = (0, oauth_util_1.generateRefreshToken)(user.id, user.role);
            return { accessToken, refreshToken };
        });
    }
    verifyEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                throw new customError_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Email not found");
            }
            if (user.verifyEmail) {
                throw new customError_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email already verified");
            }
            if (!user.otp || !user.otpExpires) {
                throw new customError_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP is not available for this user");
            }
            const isOtpValid = yield (0, password_utils_1.comparePassword)(data.otp, user.otp);
            if (!isOtpValid) {
                throw new customError_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid OTP");
            }
            const isExpiredOtp = Number(user.otpExpires) < Number(new Date());
            if (isExpiredOtp) {
                throw new customError_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP is expired");
            }
            const userReg = yield db_1.db.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    verifyEmail: true,
                    otp: null,
                    otpExpires: null,
                },
            });
            yield (0, email_1.welcomeEmail)({
                to: userReg.email,
                subject: "Welcome to Futurerify",
                name: userReg.firstName + " " + userReg.lastName,
            });
            return userReg;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, otp_utils_1.generateOtp)();
            const isUserExist = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (isUserExist) {
                throw new customError_1.CustomError(409, "Oops, email already taken");
            }
            const hashedOtp = yield (0, password_utils_2.hashPassword)(otp);
            const maxRetries = 3;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    return yield db_1.db.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield transaction.user.create({
                            data: {
                                email: data.email,
                                password: yield (0, password_utils_2.hashPassword)(data.password),
                                firstName: data.firstname,
                                lastName: data.lastname,
                                role: data.role,
                                otp: hashedOtp,
                                otpExpires: this.generateOtpExpiration().toString(),
                            },
                        });
                        yield (0, email_1.sendOtpEmail)({
                            to: data.email,
                            subject: "Verify your email",
                            otp,
                        });
                        return user;
                    }));
                }
                catch (error) {
                    console.warn(`Retry ${attempt} due to transaction failure: ${error}`);
                    if (attempt === maxRetries) {
                        throw new customError_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create user after multiple retries");
                    }
                }
            }
            throw new customError_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected error during user creation");
        });
    }
    generateOtpExpiration() {
        return new Date(Date.now() + 10 * 60 * 1000);
    }
    forgotPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, otp_utils_1.generateOtp)();
            const isUser = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (!isUser) {
                throw new customError_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
            }
            const hashedOtp = yield (0, password_utils_2.hashPassword)(otp);
            yield db_1.db.user.update({
                where: {
                    email: data.email,
                },
                data: {
                    otp: hashedOtp,
                    otpExpires: this.generateOtpExpiration().toString(),
                },
            });
            yield (0, email_1.sendOtpEmail)({
                to: data.email,
                subject: "Password Reset OTP",
                otp: `your password reset otp is ${otp}. It's valid for only ten minutes`,
            });
            return isUser;
        });
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
