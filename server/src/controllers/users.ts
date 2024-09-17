import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import UserModel from '../models/user'; //import User model to register
import { UserDocument } from '../types/user.interface';
import { Error } from 'mongoose'; //ValidationError is a class in mongoose that we can use to check if the error is a validation error
import jwt from 'jsonwebtoken';
import { secret as secretOrPrivateKey } from '../config'; //import secretOrPrivateKey from config.ts
//user object with Id and validate password method in user.interface.ts
const normalizeUser = (user: UserDocument) => {
    //id is sufficient to identify a user, but email are useful for display
    //secretOrPrivateKey is a string used for encoding and decoding tokens
    const token = jwt.sign({ id: user.id, email: user.email }, secretOrPrivateKey, { expiresIn: '1h' });
    return { //prevents the bcrypted 
        email: user.email,
        username: user.username,
        id: user._id,
        token: token, //returns token to be attached to all requests on the client and code.
    }
}
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const newUser = new UserModel({ //userModel is a mongoose model
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        console.log('newUser', newUser);
        const savedUser = await newUser.save() //mongoose save function
        console.log("savedUser", savedUser);
        res.send(normalizeUser(savedUser));
    } catch (err) {
        if (err instanceof Error.ValidationError) {
            console.log(err);
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(422).json(messages);
        }
        next(err); // will propogate the error to express which will show on screen
    }
}