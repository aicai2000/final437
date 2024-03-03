import { Schema, Model, Document, model } from "mongoose";
import { Note } from "../note";

const noteSchema = new Schema<Note>(
    {
        //createdBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
        text: { type: String, required: true, trim: true },
        username: {type: String, required: true, trim: true},
        createDate: { type: Date, required: true }

    },
    { collection: "notes" }
);

const NoteSchemaModel = model<Note>("Note", noteSchema);
export default NoteSchemaModel;