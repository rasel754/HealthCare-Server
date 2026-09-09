import { Role } from "../../generated/prisma/enums";

export interface IRequestUser {
    userId: string;
    role: Role; 
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user: IRequestUser;
        }
    }
}