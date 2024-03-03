import express, { Request, Response } from "express";
import { Note } from "./../models/note";
import noteService from "../services/note-service";

const router = express.Router();

// create new note
router.post("/", (req: Request, res: Response) => {
    const newNote = req.body;
    if(!newNote.username){
        res.status(400).send("Bad request: username is required.");
    }
    else if (!newNote.text || newNote.text.length <= 0) {
        res.status(400).send("Bad request: note text is required.");
    } else {
        newNote.createDate = Date();

        noteService
        .create(newNote)
        .then((note: Note) => {
            console.log("Create note successful");
            res.status(201).send(note);
        })
        .catch((err) => res.status(500).send(err));
    }
});

// delete
router.delete("/:id", (req: Request, res: Response) =>{
    console.log(req.params.id)
    noteService
    .deleteNoteById(req.params.id)
    .then((deleteCount: number)=> {
        if(deleteCount > 0){
            res.status(200).send("note delete successful");
        }
        else
            res.status(404).send("can't find note to delete");
    })
    .catch((err) => res.status(500).send(err));
})

export default router;