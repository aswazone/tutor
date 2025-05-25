import * as z from "zod"

export const courseLandingSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),  
  category: z.string({
    required_error: "Please select a category",
  }).min(1, "Category is required"),
  level: z.string({
    required_error: "Please select a level",
  }).min(1, "Difficulty level is required"),
  primaryLanguage: z.string({
    required_error: "Please select a primary language",
  }).min(1, "Primary language is required"),
  subtitle: z.string()
    .min(5, "Subtitle must be at least 5 characters")
    .max(50, "Subtitle must be less than 50 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters"),
  pricing: z.string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number with up to 2 decimal places")
    .refine((value) => {
      const numValue = Number(value);
      return (numValue >= 500 && numValue <= 6000);
    }, "Price must be in the range of 500 to 6000"),
  objectives: z.string()
    .min(10, "Objectives must be at least 10 characters")
    .max(1000, "Objectives must be less than 1000 characters"),
  welcomeMessage: z.string()
    .min(10, "Welcome message must be at least 10 characters")
    .max(500, "Welcome message must be less than 500 characters")
})

export type CourseLandingFormData = z.infer<typeof courseLandingSchema>
