import express, { Request, Response } from "express";
import { User } from "./../models/user";
import userService from "../services/user-service";

const router = express.Router();


// get all users
router.get("/", (req: Request, res: Response) => {
    userService
    .getAllUsers()
    .then((users: User[]) => {
        console.log(users)
        res.json(users);
    })
    .catch((err) => res.status(404).end());
});


// get user by username
router.get("/:username", (req: Request, res: Response) => {
    const { username } = req.params;
    userService
    .get(username)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).end());
});


//update existing user
router.put("/:username", (req: Request, res: Response) => {
    const { username } = req.params;
    const newUser = req.body;
    userService
    .update(username, newUser)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).end());
});


export default router;