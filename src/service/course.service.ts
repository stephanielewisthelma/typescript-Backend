
import { Course } from "../../node_modules/.prisma/client/index";
import { CreateCourseDTO } from "../dtos/createCourse.dto";

export interface CourseServices {
  createCourse(data: CreateCourseDTO): Promise<Course>;
  getCoursebyID(id: number): Promise<Course | null>;
  getAllCourses(): Promise<Course[]>;
  updateCourse(id: number, data: Partial<CreateCourseDTO>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
}