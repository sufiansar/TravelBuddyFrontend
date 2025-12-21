import * as z from "zod";

export const travelPlanFormSchema = z
  .object({
    destination: z.string().min(2, "Destination must be at least 2 characters"),

    startDate: z.date({
      message: "Start date is required",
    }),

    endDate: z.date({
      message: "End date is required",
    }),

    minBudget: z
      .number()
      .nonnegative("Minimum budget cannot be negative")
      .optional(),

    maxBudget: z
      .number()
      .nonnegative("Maximum budget cannot be negative")
      .optional(),

    travelType: z.string().min(1, "Travel type is required"),

    description: z.string().optional(),

    isPublic: z.enum(["PUBLIC", "PRIVATE"]),

    imageUrl: z.instanceof(File).optional().or(z.string().optional()),
  })
  .refine(
    (data) =>
      data.minBudget === undefined ||
      data.maxBudget === undefined ||
      data.minBudget <= data.maxBudget,
    {
      message: "Minimum budget cannot be greater than maximum budget",
      path: ["minBudget"],
    }
  )
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });
