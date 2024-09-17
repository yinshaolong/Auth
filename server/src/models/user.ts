import { Schema, model } from 'mongoose';
import { UserDocument } from '../types/user.interface';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: [true, "Email is required"], // custom falsey message
        validate: [validator.isEmail, "Invalid email"], // validator is a library that checks 
        createIndexes: { unique: true }, // unique: true, // primary key
    },
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false, // don't return password
    },
},
    {
        timestamps: true // createdAt, updatedAt
    }
);
//pre is a middleware that runs before the save method is called
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { //check if password was changed
        return next();
    }
    try { //salt is a random string that is used to hash the password e.g. password + salt = hash
        const salt = await bcryptjs.genSalt(10); // 10 is the number of rounds to generate the salt
        this.password = await bcryptjs.hash(this.password, salt);
    } catch (err) {
        return next(err as Error); // cast to Error since type is unknown
    }
});
//methods is a property of mongoose that allows us to add custom methods to our schema
userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
};

export default model<UserDocument>('User', userSchema);
