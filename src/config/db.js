"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const index_1 = require("../../node_modules/.prisma/client/index");
let db;
if (!global.__db) {
    global.__db = new index_1.PrismaClient();
}
exports.db = db = global.__db;
