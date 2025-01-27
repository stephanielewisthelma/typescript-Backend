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
exports.isAdmin = void 0;
const db_1 = require("../config/db");
const customError_1 = require("../utilis/customError");
const status_codes_1 = require("../../node_modules/http-status-codes/build/cjs/status-codes");
const index_1 = require("../../node_modules/.prisma/client/index");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findUnique({
            where: {
                id: Number(req.userAuth),
            }
        });
        if (!user) {
            throw new customError_1.CustomError(status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        if (user.role === index_1.Role.ADMIN) {
            next();
        }
        else {
            throw new customError_1.CustomError(status_codes_1.StatusCodes.FORBIDDEN, "Access denied");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.isAdmin = isAdmin;
exports.default = exports.isAdmin;
