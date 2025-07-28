"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { UpsertPatientForm } from "../upsert-pacient-form";
import { useAddPatientButton } from "./useAddPatientButton";

const AddPatientButton = () => {
  const { isOpen, setIsOpen } = useAddPatientButton();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar
        </Button>
      </DialogTrigger>

      <UpsertPatientForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

export default AddPatientButton;
