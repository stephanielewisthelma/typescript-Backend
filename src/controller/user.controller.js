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
exports.UserController = void 0;
const user_service_impl_1 = require("../service/implementation/user.service.impl");
const status_codes_1 = require("../../node_modules/http-status-codes/build/cjs/status-codes");
class UserController {
    constructor() {
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const newUser = yield this.userService.createUser(userData);
                res.status(201).json(newUser);
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id);
                const user = yield this.userService.getUserById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id);
                const userData = req.body;
                const updatedUser = yield this.userService.updateUser(userId, userData);
                res.status(200).json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        });
        this.profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userAuth;
                const user = yield this.userService.getUserById(Number(id));
                res.status(status_codes_1.StatusCodes.OK).json({
                    error: false,
                    message: "User profile retrieved successfully",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateProfilePic = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth;
                if (!req.file || !req.file.path) {
                    res.status(400).json({
                        error: true,
                        message: "No profile image uploaded",
                    });
                    return;
                }
                const profilePicUrl = req.file.path; // Cloudinary URL after upload
                yield this.userService.updateProfilePic(Number(userId), {
                    profilePic: profilePicUrl,
                });
                res.status(200).json({
                    error: false,
                    message: "Profile picture updated successfully",
                    data: { profilePic: profilePicUrl },
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.userService = new user_service_impl_1.UserServiceImpl();
    }
}
exports.UserController = UserController;
