import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deletePatients } from "@/actions/patients/delete-patients";
import { patientsTable } from "@/db/schema";

const useButtonsPatientsTable = (
  patient: typeof patientsTable.$inferSelect,
) => {
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
  };
};
export default useButtonsPatientsTable;
