import z from "zod";

export const meetupSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  maxPeople: z.string().optional(),
});

export type MeetupFormData = z.infer<typeof meetupSchema>;
