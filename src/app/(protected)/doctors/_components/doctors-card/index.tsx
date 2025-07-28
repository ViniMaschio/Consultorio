"use client";
import { CalendarIcon, TrashIcon } from "lucide-react";

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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { formartCurrencyInCents } from "@/helpers/currency";

import UpsertDoctorForm from "../upsert-doctor-form";
import useDoctorsCard from "./useDoctorsCard";

interface DoctorsCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorsCard = ({ doctor }: DoctorsCardProps) => {
  const { doctorInitials, from, to, isOpen, setIsOpen, handleDelete } =
    useDoctorsCard({ doctor });
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant={"outline"}>
          <CalendarIcon className="mr-1" />
          {from.format("dddd")} - {to.format("dddd")}
        </Badge>
        <Badge variant={"outline"}>
          {from.format("HH:mm")} as {to.format("HH:mm")}
        </Badge>
        <Badge variant={"outline"}>
          {formartCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TrashIcon className="mr-2" />
              Apagar Medico
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja apagar este médico?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso apagará permanentemente o
                médico e todas as consultas agendadas.
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver Detalhes</Button>
          </DialogTrigger>

          <UpsertDoctorForm
            doctor={{
              ...doctor,
              availableFromTime: from.format("HH:mm:ss"),
              availableToTime: to.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsOpen(false)}
            isOpen={isOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};
export default DoctorsCard;
