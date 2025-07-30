import z from "zod";

export const upsertAppointmentsSchema = z.object({
  id: z.string().optional(),
  appointmentPriceInCents: z.number().int().nonnegative(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  clinicId: z.string().uuid().optional(),
  date: z.date(),
});
