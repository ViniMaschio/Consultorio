import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteDoctor } from "@/actions/doctors/delete-doctor";
import { doctorsTable } from "@/db/schema";

import { getAvailability } from "./_helpers/availability";

interface DoctorsCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}
export const useDoctorsCard = ({ doctor }: DoctorsCardProps) => {
  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("");
  const { from, to } = getAvailability(doctor);
  const [isOpen, setIsOpen] = useState(false);
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success("Médico deletado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar médico");
      console.error("Erro ao deletar médico:", error);
    },
  });
  const handleDelete = () => {
    if (!doctor) return;
    deleteDoctorAction.execute({ id: doctor.id });
  };
  return {
    doctorInitials,
    from,
    to,
    isOpen,
    setIsOpen,
    handleDelete,
    deleteDoctorAction,
  };
};
export default useDoctorsCard;
