"use client";
import { CalendarIcon } from "lucide-react";

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
import { getAvailability } from "./_helpers/availability";

interface DoctorsCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorsCard = ({ doctor }: DoctorsCardProps) => {
  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("");
  const { from, to } = getAvailability(doctor);
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
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Ver Detalhes</Button>
          </DialogTrigger>

          <UpsertDoctorForm />
        </Dialog>
      </CardFooter>
    </Card>
  );
};
export default DoctorsCard;
