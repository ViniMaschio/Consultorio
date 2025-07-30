"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import UpsertAppointmentsForm from "../upsert-appointments-form";
import { useAddAppointmentsButton } from "./useAddAppointmentsButton";

interface AddAppointmentsButtonProps {
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
}

const AddAppointmentsButton = ({
  doctors,
  patients,
}: AddAppointmentsButtonProps) => {
  const { isOpen, setIsOpen } = useAddAppointmentsButton();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar
        </Button>
      </DialogTrigger>

      <UpsertAppointmentsForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        doctors={doctors}
        patients={patients}
      />
    </Dialog>
  );
};

export default AddAppointmentsButton;
