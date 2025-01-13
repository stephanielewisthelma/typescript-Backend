
import { User } from "../../node_modules/.prisma/client/default";
import { CreateUserDTO } from "../dtos/createUser.dto";

export interface UserService {
    createUser(data: CreateUserDTO): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getAllsers(): Promise<User[]>;
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
}