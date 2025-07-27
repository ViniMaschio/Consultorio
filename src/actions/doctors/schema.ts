import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(),
    clinicId: z.string().uuid().optional(),
    name: z.string().trim().min(1, "Nome é obrigatório"),
    specialty: z.string().trim().min(1, "Especialidade é obrigatória"),
    appointmentPriceInCents: z
      .number()
      .min(1, "Preço da consulta deve ser maior ou igual a zero"),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().min(1, "Hora de início é obrigatória"),
    availableToTime: z.string().min(1, "Hora de término é obrigatória"),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "Hora de término deve ser posterior a hora de início",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
