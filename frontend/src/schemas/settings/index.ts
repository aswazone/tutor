import { z } from "zod";

export const teacherSettingsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  bio: z.string().min(20, "Bio must be at least 20 characters long").max(500, "Bio must not exceed 500 characters"),
  expertise: z.string().min(3, "Please specify at least one area of expertise"),
  acceptNewStudents: z.boolean(),
  automaticConfirmation: z.boolean(),
  maxStudents: z.number().min(1, "Must accept at least 1 student").max(100, "Cannot exceed 100 students"),
  emailNotifications: z.boolean(),
  courseUpdates: z.boolean(),
});

export const studentSettingsSchema = z.object({
  interests: z.string().min(3, "Please specify at least one learning interest"),
  goals: z.string().min(20, "Goals must be at least 20 characters long").max(500, "Goals must not exceed 500 characters"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  courseRecommendations: z.boolean(),
  studyReminders: z.boolean(),
  preferredTime: z.enum(["morning", "afternoon", "evening"]),
  emailUpdates: z.boolean(),
  learningProgress: z.boolean(),
});

export type TeacherSettingsFormData = z.infer<typeof teacherSettingsSchema>;
export type StudentSettingsFormData = z.infer<typeof studentSettingsSchema>;