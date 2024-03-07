import { Document } from "mongoose";
import { User } from "./../models/user";
import UserSchemaModel from "./../models/mongo/user-schema-model";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from 'express';

export function index(): Promise<User[]> {
    return UserSchemaModel.find();
}

export function get(username: String): Promise<User> {
    return UserSchemaModel.find({ username })
    .then((list) => list[0])
    .catch((err) => {
        throw `${username} Not Found`;
    });
}

export function getAllUsers(): Promise<User[]> {
  return UserSchemaModel.find({})
  .then((list) => list)
  .catch((err) => {
      throw `error get all users - ${err} `;
  });
}

export function create(user: User): Promise<User> {
    const p = new UserSchemaModel(user);
    return p.save();
}


export function createUser(newUser: User) {
  return new Promise<User>((resolve, reject) => {
    if (!newUser.username || !newUser.password) {
      reject("must provide username and password");
    }
    UserSchemaModel
      .find({ username: newUser.username })
      .then((found: User[]) => {
        if (found && found.length >= 1)
            reject("username exists");
          else return true;
      })
      .then((usernameUnique) =>{
        if (usernameUnique){ 
          bcrypt
            .genSalt(10)
            .then((salt: string) => bcrypt.hash(newUser.password, salt))
            .then((hashedPassword: string) => {
              const user = new UserSchemaModel({
                username:newUser.username,
                password: hashedPassword,
                firstName:newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role ?? "member"
              });
              user.save().then((createdNewUser: User) => {
                if (createdNewUser) resolve(createdNewUser);
              });
            })
        }
        }
      );
  });
}

export function update(username: String, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
        UserSchemaModel.findOneAndUpdate({ username }, user, {
            new: true,
    }).then((user) => {
        if (user) resolve(user);
        else reject("Failed to update user profile");
    });
    });
}

export function loginUser(username: string, password: string) {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      reject("must provide username and password");
    } else {
      verify(username, password)
        .then((goodUser: String) => generateAccessToken(goodUser))
        .then((token) =>{
          if(token) resolve(token)
        })
        .catch((error) => reject("Unauthorized"));
    }
  })
}

export function verify(
  username: string,
  password: string
): Promise<String> {
  return new Promise<String>((resolve, reject) => {
    UserSchemaModel
      .find({ username })
      .then((found) => {
        console.log(found)
        if (found && found.length >= 1) return found[0];
        else reject("Invalid username or password");
      })
      .then((userOnFile) => {

        if(userOnFile){
          bcrypt.compare(password, userOnFile.password, (err, data) => {
            //if error than throw error
            if (err) throw err
            console.log(data);
            //if both match than you can do anything
            if (data) {
              resolve(userOnFile.username);
                //return res.status(200).json({ msg: "Login success" })
            } else {
                reject("Invalid username or password");
                //return res.status(401).json({ msg: "Invalid credencial" })
            }
          })
        }
        else reject("Invalid username or password");
        
      });
  });
}

export function checkExists(username: string) {
  return new Promise<boolean>((resolve, reject) => {
    UserSchemaModel
      .find({ username })
      .then((found) => resolve(found && found.length > 0));
  });
}

export function generateAccessToken(username: String) {
    console.log("Generating token for", username);
    
    return new Promise((resolve, reject) => {
    jwt.sign({ username: username }, process.env.JWT_SECRET as string, 
      { expiresIn: '1h'}, 
      (err, encodedToken)=>{
          err ? reject(err) : resolve(encodedToken)
      })
    })
  };

//const getUsernameFromToken = (token) => jwt.decode(token)["username"];

//exports.getAudienceFromToken = (token) => jwt.decode(token)["aud"];
  
export default { index, get, getAllUsers, create, update, generateAccessToken, createUser, loginUser, verify }