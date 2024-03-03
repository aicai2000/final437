import { Document } from "mongoose";
import { Note } from "./../models/note";
import NoteSchemaModel from "./../models/mongo/note-schema-model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from 'express';


export function get(username: String): Promise<Note[]> {
    return NoteSchemaModel.find({ username })
    .then((list) => list)
    .catch((err) => {
        throw `${username} Not Found`;
    });
}

export function getAllNotes(): Promise<Note[]> {
    return NoteSchemaModel.find({})
    .then((list) => list)
    .catch((err) => {
        throw `error get all notes - ${err} `;
    });
  }

export function create(note: Note): Promise<Note> {
    const newNote = new NoteSchemaModel(note);
    return newNote.save();
}

export function deleteNoteById(id: string) {
    var mongodb = require('mongodb');
    return new Promise<number>((resolve, reject) => {
        try
        {
            NoteSchemaModel
            .deleteOne({ "_id": new mongodb.ObjectId(id) })
            .then((deleteResult) => {
                console.log(deleteResult);
                resolve(deleteResult.deletedCount); //{ acknowledged: true, deletedCount: 0 }
            });
        }
        catch (err) {
            throw `error delete note - ${err} `;
        }
    });
  }
  

export default { get, getAllNotes, create, deleteNoteById }