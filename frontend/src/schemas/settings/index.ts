import { z } from "zod";

export const profileSettingsSchema = z.object({
  qualification: z.string().min(3, "Title must be at least 3 characters long"),
  about: z.string().min(20, "Bio must be at least 20 characters long").max(500, "Bio must not exceed 500 characters"),
  expertise: z.string().min(3, "Please specify at least one area of expertise"),
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

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters long"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;
export type StudentSettingsFormData = z.infer<typeof studentSettingsSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;