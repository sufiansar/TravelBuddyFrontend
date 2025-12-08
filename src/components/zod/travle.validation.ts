import z from "zod";

export const travelPlanFormSchema = z
  .object({
    destination: z.string().min(2, "Destination must be at least 2 characters"),
    startDate: z.date({
      message: "Start date is required",
    }),
    endDate: z.date({
      message: "End date is required",
    }),
    minBudget: z.number().optional(),
    maxBudget: z.number().optional(),
    travelType: z.string().min(1, "Travel type is required"),
    description: z.string().optional(),
    isPublic: z.enum(["PUBLIC", "PRIVATE"]),
  })
  .refine(
    (data) => {
      if (data.minBudget && data.maxBudget && data.minBudget > data.maxBudget) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum budget cannot be greater than maximum budget",
      path: ["minBudget"],
    }
  )
  .refine(
    (data) => {
      return data.endDate >= data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );
