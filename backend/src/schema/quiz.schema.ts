import { IQuizModel } from '@/models/interface/quiz.model.interface';
import { Schema, model } from 'mongoose'

const QuizSchema = new Schema({
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }]
    }]
}, {
    timestamps: true
});

export const Quiz = model<IQuizModel>('Quiz', QuizSchema);