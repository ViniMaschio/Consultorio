import z from "zod";

export const upsertPatientsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phoneNumber: z.string().min(15).max(15).trim(),
  sex: z.enum(["male", "female"]),
  clinicId: z.string().optional(),
});
export type UpsertPatientsSchema = z.infer<typeof upsertPatientsSchema>;
