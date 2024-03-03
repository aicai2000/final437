import { Schema, Model, Document, model } from "mongoose";
import { User } from "../user";

const userSchema = new Schema<User>(
    {
        username: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
    },
    { collection: "users" }
);

const UserSchemaModel = model<User>("User", userSchema);
export default UserSchemaModel;