import { IsNotEmpty, IsNumber, Length} from "class-validator";

export class CreateCourseDTO{
    @IsNotEmpty()
    @Length(2, 30)
    title!: string

    @IsNotEmpty()
    @Length(10, 200)
    description!: string

    @IsNotEmpty()
    @IsNumber()
    duration!: number

    @IsNotEmpty()
    @IsNumber()
    price!: number
}
