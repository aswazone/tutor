import { Schema, model } from 'mongoose';
import { ICourseModel } from '@/models/interface/course.model.interface';

const ChapterSchema = new Schema({
  id: String,
  title: String,
  content: String,
  videoKey: String,
  pdfUrl: String,
  freePreview: {
    type: Boolean,
    default: false
  },
  videoUploadStatus: {
    type: String,
    enum: ['idle', 'uploading', 'success', 'error'],
    default: 'idle'
  },
  videoUploadError: String
});

const ModuleSchema = new Schema({
  id: String,
  title: String,
  description: String,
  chapters: [ChapterSchema]
});

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  primaryLanguage: {
    type: String,
    required: true
  },
  subtitle: String,
  description: {
    type: String,
    required: true
  },
  pricing: {
    type: String,
    required: true
  },
  objectives: String,
  welcomeMessage: String,
  thumbnailKey: {
    type: String,
    required: true
  },
  students: [
    {
      studentId:String,
      studentName: String,
      studentEmail: String,
      paidAmount: String
    }
  ],
  modules: {
    type: [ModuleSchema],
    required: true
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  rating:{
    type: Number,
    default: 0
  },
  isVerified: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rejectReason:{
    type: String,
    default: ''
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hasQuiz: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Course = model<ICourseModel>('Course', CourseSchema);
