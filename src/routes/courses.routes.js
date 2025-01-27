"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controller/course.controller");
const courseController = new course_controller_1.CourseController();
const courseRouter = express_1.default.Router();
courseRouter.post("/", courseController.createCourse);
courseRouter.get("/", courseController.getAllCourses);
courseRouter.get("/:id", courseController.getCourseById);
courseRouter.put("/:id", courseController.updateCourse);
courseRouter.delete("/:id", courseController.deleteCourse);
exports.default = courseRouter;
