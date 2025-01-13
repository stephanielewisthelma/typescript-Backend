
import { CreateCourseDTO } from "../../dtos/createCourse.dto";
import { CourseServices } from "../course.service";
import { CustomError } from "../../utilis/customError";
import { db } from "../../config/db";
import { Course } from "../../../node_modules/.prisma/client/index";

export class CourseServiceImpl implements CourseServices {
  async createCourse(data: CreateCourseDTO): Promise<Course> {
    const isCourseExist = await db.course.findFirst({
      where: {
        title: data.title,
      },
    });
    if (isCourseExist) {
      throw new CustomError(409, "Oops course already exists");
    }
    const course = await db.course.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        price: data.price,
      },
    });
    return course;
  }

  async getCoursebyID(id: number): Promise<Course | null> {
    const course = await db.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new CustomError(404, "course not found");
    }
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.course.findMany();
  }

  async updateCourse(
    id: number,
    data: Partial<CreateCourseDTO>
  ): Promise<Course> {
    const isCourseExist = await db.course.update({
      where: { id },
      data,
    });
    if (!isCourseExist) {
      throw new CustomError(404, "User not found in the database");
    }
    const course = await db.course.update({
      where: { id },
      data,
    });
    return course;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.course.delete({
      where: { id },
    });
  }
}