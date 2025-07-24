
import { INoteModel } from "@/models/interface/note.model.interface";
import { model, Schema } from "mongoose";

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    chapterId: {
        type:String,
        required: true,
    },
    timestamp: {
        type: Number, 
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    
}, { timestamps: true });

export const Note = model<INoteModel>('Note', noteSchema);