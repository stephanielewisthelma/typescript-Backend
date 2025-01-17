
import { promises } from "dns";
import { User } from "../../node_modules/.prisma/client/default";
import { CreateUserDTO } from "../dtos/createUser.dto";

export interface UserService {
    createUser(data: CreateUserDTO): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    profile(id:number):Promise<Omit<User,"password">>;
}