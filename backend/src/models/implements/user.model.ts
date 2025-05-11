import {model, Schema } from "mongoose";
import { UserModelIF } from "../interface/user.model.interface";


const UserSchema = new Schema<UserModelIF>({
    userName:{
        type: String,
        required:[true, 'User Name is required'],
        trim:true,
        minLength:2,
        maxLength:50
    },
    userEmail:{
        type: String,
        required:[true, 'User Email is required'],
        unique:true,
        match:[/\S+@\S+\.\S+/, 'Please fill a vaild email address']
    },
    name: {
        type: String,
        minLength:4,
        maxLength:20
    },
    password:{
        type: String,
        required:[true, 'User Password is required'],
        minLength:6,
    },
    role: {
        type: String,
        enum: ['tutor', 'student'],
        required: true
    },
})

export const User = model<UserModelIF>('User', UserSchema);
