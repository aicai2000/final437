import { User } from "./user";

export interface Note {
    id: string;
    // createdBy: User
    username: string
    text: string;
    createDate: Date;
   }   