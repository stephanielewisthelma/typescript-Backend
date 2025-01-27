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
exports.CourseServiceImpl = void 0;
const customError_1 = require("../../utilis/customError");
const db_1 = require("../../config/db");
class CourseServiceImpl {
    createCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCourseExist = yield db_1.db.course.findFirst({
                where: {
                    title: data.title,
                },
            });
            if (isCourseExist) {
                throw new customError_1.CustomError(409, "Oops course already exists");
            }
            const course = yield db_1.db.course.create({
                data: {
                    title: data.title,
                    description: data.description,
                    duration: data.duration,
                    price: data.price,
                },
            });
            return course;
        });
    }
    getCoursebyID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield db_1.db.course.findUnique({
                where: { id },
            });
            if (!course) {
                throw new customError_1.CustomError(404, "course not found");
            }
            return course;
        });
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.course.findMany();
        });
    }
    updateCourse(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCourseExist = yield db_1.db.course.update({
                where: { id },
                data,
            });
            if (!isCourseExist) {
                throw new customError_1.CustomError(404, "User not found in the database");
            }
            const course = yield db_1.db.course.update({
                where: { id },
                data,
            });
            return course;
        });
    }
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.course.delete({
                where: { id },
            });
        });
    }
}
exports.CourseServiceImpl = CourseServiceImpl;
