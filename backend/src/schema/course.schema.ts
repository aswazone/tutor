import { Schema, model } from 'mongoose';
import { ICourseModel } from '@/models/interface/course.model.interface';

const ChapterSchema = new Schema({
  id: String,
  title: String,
  content: String,
  videoKey: String,
  pdfUrl: String,
  subtitleUrl: String,
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
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Course = model<ICourseModel>('Course', CourseSchema);
