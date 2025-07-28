import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPatients } from "@/actions/patients/upsert-patients";
import { patientsTable } from "@/db/schema";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phoneNumber: z
    .string()
    .trim()
    .min(15, "Número de telefone inválido")
    .max(15, "Número de telefone inválido"),
  sex: z.enum(["male", "female"], {
    required_error: "Precisa colocar sexo",
  }),
  clinicId: z.string().optional(),
});

interface UpsertPatientFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  patient?: typeof patientsTable.$inferSelect;
}
export const useUpsertPatientForm = ({
  onSuccess,
  patient,
  isOpen,
}: UpsertPatientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: patient?.id || undefined,
      name: patient?.name || "",
      email: patient?.email || "",
      phoneNumber: patient?.phoneNumber || "",
      sex: patient?.sex || undefined,
      clinicId: patient?.clinicId || undefined,
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset(patient);
    }
  }, [isOpen, patient, form]);

  const upsertPatientAction = useAction(upsertPatients, {
    onSuccess: () => {
      toast.success("Paciente salvo com sucesso!");
      onSuccess?.();
    },
    onError: (erro) => {
      toast.error("Erro ao salvar paciente!");
      console.error("Erro ao salvar paciente:", erro);
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
    });
  };
  return {
    form,
    onSubmit,
    upsertPatientAction,
  };
};
