import express, { Request, Response } from "express";
import cors from "cors";
import { connect } from "./mongoConnect";

import userService from "./services/user-service";
import { User } from "./models/user";
import apiRouter from "./routes/api";


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
connect("clusteremu"); 


app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// sign up
app.post("/api/signup", (req: Request, res: Response) => {
    const newUser = req.body; // from form
    console.log(req.body)
    if (!newUser.username || !newUser.password) {
      res.status(400).send("Bad request: Invalid input data.");
    } else {
      userService.createUser(newUser)
        .then((createdNewUser) => userService.generateAccessToken(createdNewUser.username))
        .then((token) => {
          res.status(201).send({ token: token });
        })
      .catch(err=>res.status(500).send(err));
    }
  });

// create new user, it's part of sign up
app.post("/api/users", (req: Request, res: Response) => {
    const newUser = req.body;
    userService
    .createUser(newUser)
    .then((user: User) => {
        console.log("Create user successful");
        res.status(201).send(user);
    })
    .catch((err) => res.status(500).send(err));
});
   

// login
app.post("/api/login", (req: Request, res: Response) => {
    const { username, password } = req.body; // from form
  
    userService
    .loginUser(username, password)
    .then((token) => res.status(200).send({ token: token }))
    .catch((error) => res.status(401).send("Unauthorized"));

});

app.use("/api", apiRouter);

// //update existing user, moved to user-route
// app.put("/api/users/:username", (req: Request, res: Response) => {
//     const { username } = req.params;
//     const newUser = req.body;
//     userService
//     .update(username, newUser)
//     .then((user: User) => res.json(user))
//     .catch((err) => res.status(404).end());
// });


// // get user by username, moved to user-route
// app.get("/api/users/:username", (req: Request, res: Response) => {
//     const { username } = req.params;
//     userService
//     .get(username)
//     .then((user: User) => res.json(user))
//     .catch((err) => res.status(404).end());
// });


app.get("/logout", (req, res) => {});

app.get("/api/users", (req, res) => {});

app.get("/api/notes/:username", (req, res) => {});


app.get("/favorite", (req, res) => {});

app.post("api/note", (req, res) => {});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});