import * as z from 'zod';

export const InterviewFormSchema = z.object({
  domain: z.string().trim().min(5, "Job position is required"),
  description: z.string().trim().min(1, "Job description is required"),
  duration: z.string({
    required_error: "Duration is required",
  }),
  interviewTypes: z.array(z.string()).min(1, "Select at least one interview type"),
});

export type InterviewFormData = z.infer<typeof InterviewFormSchema>;