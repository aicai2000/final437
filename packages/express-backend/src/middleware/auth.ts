import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
    //console.log("authenticateUser req", req);
    const authHeader = req.headers["authorization"];
    //Getting the 2nd part of the auth header (the token)
    const token = authHeader && authHeader.split(" ")[1];
    //const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).end();
    } else {
      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (error, decoded) => {
          if (decoded) {
            console.log("Decoded token", decoded);
            next();
          } else {
            res.status(401).end();
          }
        }
      );
    }
  }
  