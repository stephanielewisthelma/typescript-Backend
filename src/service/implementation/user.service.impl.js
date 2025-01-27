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
exports.UserServiceImpl = void 0;
const customError_1 = require("../../utilis/customError");
const db_1 = require("../../config/db");
const password_utils_1 = require("../../utilis/password.utils");
const status_codes_1 = require("../../../node_modules/http-status-codes/build/cjs/status-codes");
class UserServiceImpl {
    profile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: { id },
            });
            if (!user) {
                throw new customError_1.CustomError(status_codes_1.StatusCodes.NOT_FOUND, `user with id ${id} not found`);
            }
            return user;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (isUserExist) {
                throw new customError_1.CustomError(409, "Oops email already taken");
            }
            const user = yield db_1.db.user.create({
                data: {
                    email: data.email,
                    password: yield (0, password_utils_1.hashPassword)(data.password),
                    firstName: data.firstname,
                    lastName: data.lastname,
                    role: data.role,
                },
            });
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.user.findUnique({
                where: { id }
            });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.user.findMany();
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExists = yield db_1.db.user.findFirst({
                where: { id, }
            });
            if (!isUserExists) {
                throw new customError_1.CustomError(404, "There is no user with id: ${id}");
            }
            const user = yield db_1.db.user.update({
                where: { id },
                data,
            });
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.user.delete({
                where: { id },
            });
        });
    }
    updateProfilePic(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: { id },
            });
            if (!user) {
                throw new customError_1.CustomError(status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            const updatedUser = yield db_1.db.user.update({
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
        });
    }
}
exports.UserServiceImpl = UserServiceImpl;
