import express from "express";
import { authenticateUser } from "../middleware/auth";
import { Request, Response, NextFunction } from 'express';
import { Note } from "./../models/note";
import noteService from "../services/note-service";
import  userRouter  from "./user-route";
import  noteRouter  from "./note-route";

const router = express.Router();

router.use("/users", authenticateUser, userRouter);
router.use("/note", authenticateUser, noteRouter);

// get all notes
router.get("/notes", (req: Request, res: Response) => {
    noteService
    .getAllNotes()
    .then((notes: Note[]) => {
        console.log(notes)
        res.json(notes);
    })
    .catch((err) => res.status(404).end());
});

// get notes by username
router.get("/notes/:username", (req: Request, res: Response) => {
    const { username } = req.params;
    noteService
    .get(username)
    .then((notes: Note[]) => res.json(notes))
    .catch((err) => res.status(404).end());
});


export default router;