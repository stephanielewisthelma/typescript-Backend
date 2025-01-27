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
exports.CourseController = void 0;
const course_service_impl_1 = require("../service/implementation/course.service.impl");
class CourseController {
    constructor() {
        this.createCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseData = req.body;
                const newCourse = yield this.courseService.createCourse(courseData);
                res.status(201).json(newCourse);
            }
            catch (error) {
                next(error);
            }
        });
        this.getCourseById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const couseId = parseInt(req.params.id);
                const course = yield this.courseService.getCoursebyID(couseId);
                if (!course) {
                    return res.status(404).json({ message: "Course not found" });
                }
                res.status(200).json(course);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllCourses = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.courseService.getAllCourses();
                res.status(200).json(courses);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                const courseData = req.body;
                const updateCourse = yield this.courseService.updateCourse(courseId, courseData);
                res.status(200).json(updateCourse);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteCourse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = parseInt(req.params.id);
                const course = yield this.courseService.deleteCourse(courseId);
                res.status(200).json(course);
            }
            catch (error) {
                next(error);
            }
        });
        this.courseService = new course_service_impl_1.CourseServiceImpl();
    }
}
exports.CourseController = CourseController;
