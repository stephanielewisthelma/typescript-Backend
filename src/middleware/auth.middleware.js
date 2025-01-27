"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aunthenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status_codes_1 = require("../../node_modules/http-status-codes/build/cjs/status-codes");
const utils_functions_1 = require("../../node_modules/http-status-codes/build/cjs/utils-functions");
const aunthenticateUser = (req, res, next) => {
    try {
        const authHeader = req === null || req === void 0 ? void 0 : req.headers["authorization"];
        if (!authHeader) {
            res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                message: "Authorization Required",
            });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || " ", (err, decoded) => {
            if (err) {
                res.status(status_codes_1.StatusCodes.FORBIDDEN).json({
                    message: "Invalid or expired token.",
                });
            }
            const payload = decoded;
            req.userAuth = payload.id;
            next();
        });
    }
    catch (error) {
        res.status(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (0, utils_functions_1.getReasonPhrase)(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR),
            error: error.message,
        });
    }
};
exports.aunthenticateUser = aunthenticateUser;
