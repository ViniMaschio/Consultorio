"use client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  MailIcon,
  PhoneCallIcon,
  TrashIcon,
  VenusAndMarsIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { patientsTable } from "@/db/schema";

import { UpsertPatientForm } from "../upsert-pacient-form";
import usePatientCard from "./usePatientCard";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const { isOpen, setIsOpen, handleDelete, doctorInitials } = usePatientCard({
    patient,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{patient.name}</h3>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant={"outline"}>
          <MailIcon className="mr-1" />
          {patient.email}
        </Badge>
        <Badge variant={"outline"}>
          <PhoneCallIcon className="mr-1" />
          {patient.phoneNumber}
        </Badge>
        <Badge variant={"outline"}>
          <VenusAndMarsIcon className="mr-1" />
          {patient.sex}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        {patient && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <TrashIcon className="mr-2" />
                Apagar Paciente
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja apagar este paciente?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso apagará permanentemente
                  o paciente e todas as consultas agendadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver Detalhes</Button>
          </DialogTrigger>

          <UpsertPatientForm
            patient={patient}
            onSuccess={() => setIsOpen(false)}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
