import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { upsertDoctor } from "@/actions/doctors/upsert-doctor";
import { doctorsTable } from "@/db/schema";

const formSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório"),
    specialty: z.string().trim().min(1, "Especialidade é obrigatória"),
    appointmentPrice: z
      .number()
      .min(1, "Preço da consulta deve ser maior ou igual a zero"),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
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

interface UpsertDoctorFormProps {
  onSuccess?: () => void;
  doctor?: typeof doctorsTable.$inferSelect;
}
export const useUpsertDoctorForm = ({
  onSuccess,
  doctor,
}: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name || "",
      specialty: doctor?.specialty || "",
      appointmentPrice:
        doctor?.appointmentPriceInCents !== undefined
          ? doctor.appointmentPriceInCents / 100
          : 0,
      availableFromWeekDay: doctor?.availableFromWeekDay.toString() || "1",
      availableToWeekDay: doctor?.availableToWeekDay.toString() || "5",
      availableFromTime: doctor?.availableFromTime || "",
      availableToTime: doctor?.availableToTime || "",
    },
  });
  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico salvo com sucesso!");
      onSuccess?.();
    },
    onError: (erro) => {
      toast.error("Erro ao salvar médico");
      console.error("Erro ao salvar médico:", erro);
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      id: doctor?.id,
      availableFromWeekDay: parseInt(values.availableFromWeekDay, 10),
      availableToWeekDay: parseInt(values.availableToWeekDay, 10),
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };
  return {
    form,
    onSubmit,
    upsertDoctorAction,
  };
};
