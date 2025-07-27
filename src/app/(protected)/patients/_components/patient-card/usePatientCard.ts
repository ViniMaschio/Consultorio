import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deletePatients } from "@/actions/patients/delete-patients";
import { patientsTable } from "@/db/schema";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

export const usePatientCard = ({ patient }: PatientCardProps) => {
  const doctorInitials = patient.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("");
  const [isOpen, setIsOpen] = useState(false);
  const deletePatientAction = useAction(deletePatients, {
    onSuccess: () => {
      toast.success("Paciente deletado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar paciente");
      console.error("Erro ao deletar paciente:", error);
    },
  });
  const handleDelete = () => {
    if (!patient) return;
    deletePatientAction.execute({ id: patient.id });
  };

  return {
    isOpen,
    setIsOpen,
    handleDelete,
    doctorInitials,
  };
};
export default usePatientCard;
