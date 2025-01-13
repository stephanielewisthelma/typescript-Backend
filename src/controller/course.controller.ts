import { Response, Request, NextFunction } from "express";
import { CourseServiceImpl } from "../service/implementation/course.service.impl";
import { CreateCourseDTO } from "../dtos/createCourse.dto";

export class CourseController {
  private courseService: CourseServiceImpl;

  constructor() {
    this.courseService = new CourseServiceImpl();
  }

  public createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseData = req.body as CreateCourseDTO;
      const newCourse = await this.courseService.createCourse(courseData);
      res.status(201).json(newCourse);
    } catch (error) {
      next(error);
    }
  };
  public getCourseById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const couseId = parseInt(req.params.id);
      const course = await this.courseService.getCoursebyID(couseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };
  public getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };
  public updateCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    try {
      const courseId = parseInt(req.params.id);
      const courseData = req.body as Partial<CreateCourseDTO>;
      const updateCourse = await this.courseService.updateCourse(
        courseId,
        courseData
      );
      res.status(200).json(updateCourse);
    } catch (error) {
      next(error);
    }
  };
  public deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await this.courseService.deleteCourse(courseId);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };
}