"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "../upsert-doctor-form";
import { useAddDoctorButton } from "./useAddDoctorButton";

const AddDoctorButton = () => {
  const { isOpen, setIsOpen } = useAddDoctorButton();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar
        </Button>
      </DialogTrigger>

      <UpsertDoctorForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddDoctorButton;
