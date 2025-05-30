import {model, Schema } from "mongoose";
import { IUserModel } from "../interface/user.model.interface";
import { UserStatus } from "@/types/user.type";


const UserSchema = new Schema<IUserModel>({
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
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: String,
        enum: ['verified', 'pending','unverified', 'rejected'],
        default: UserStatus.UNVERIFIED
    },
    tutorDetails: {
        type: {
            qualification:{type: String, default: ''},
            experience: {type: Number, default: 0},
            expertise: {type: String, default: ''},
            about: {type: String, default: ''},
            resume: {type: String, default: ''},
            rejectReason: {type: String, default: ''},
        },
        default: null
    },
    profileImage: {type: String, default: ''},
    wishlist:[{
        type:Schema.Types.ObjectId,
        ref:'Course'
    }],

},{timestamps:true});

export const User = model<IUserModel>('User', UserSchema);
