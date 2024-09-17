import { Document } from 'mongoose';

export interface User {
    email: string; // what we use for validation/ send email
    username: string;
    password: string; //will be hashed
    createdAt: Date; // part of mongoose
}

export interface UserDocument extends User, Document {
    validatePassword(password: string): string;
}