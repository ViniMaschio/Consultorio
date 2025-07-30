"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertAppointments } from "@/actions/appointments/upsert-appointments";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

const formSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  appointmentPrice: z.number().min(0.01, "Preço deve ser maior que zero"),
  patientId: z.string().uuid("Selecione um paciente"),
  doctorId: z.string().uuid("Selecione um médico"),
  clinicId: z.string().uuid().optional(),
  time: z.string().min(1, "Selecione um horário"),
});

interface UpsertAppointmentsFormProps {
  onSuccess?: () => void;
  appointment?: typeof appointmentsTable.$inferSelect;
  doctors: (typeof doctorsTable.$inferSelect)[];
  patients: (typeof patientsTable.$inferSelect)[];
  isOpen?: boolean;
}

const UpsertAppointmentsForm = ({
  onSuccess,
  appointment,
  doctors,
  patients,
  isOpen,
}: UpsertAppointmentsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: appointment?.id || undefined,
      date: appointment?.date || new Date(),
      appointmentPrice:
        appointment?.appointmentPriceInCents !== undefined
          ? appointment.appointmentPriceInCents / 100
          : 0,
      patientId: appointment?.patientId || "",
      doctorId: appointment?.doctorId || "",
      time: "",
    },
  });

  const upsertAppointmentsAction = useAction(upsertAppointments, {
    onSuccess: () => {
      toast.success("Consulta salva com sucesso!");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Erro ao salvar consulta");
      console.error("Error saving appointment:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertAppointmentsAction.execute({
      ...values,
      id: appointment?.id,
      appointmentPriceInCents: values.appointmentPrice * 100,
      date: (() => {
        const [hora, minuto] = values.time.split(":").map(Number);
        values.date.setHours(hora);
        values.date.setMinutes(minuto);
        return values.date;
      })(),
    });
    console.log("Submitted values:", values);
  };

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: appointment?.id || undefined,
        date: appointment?.date || undefined,
        patientId: appointment?.patientId || "",
        doctorId: appointment?.doctorId || "",
        appointmentPrice: (appointment?.appointmentPriceInCents ?? 0) / 100,
      });
    }
  }, [isOpen, appointment, form]);

  const [open, setOpen] = useState(false);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {appointment ? "Editar Consulta" : "Adicionar Consulta"}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? "Edite os detalhes da consulta."
            : "Adicione os detalhes da nova consulta."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da Consulta</FormLabel>

                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  placeholder="Preço da consulta"
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$ "
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Consulta</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {field.value
                        ? field.value.toLocaleDateString()
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário final de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="05:00:00">05:00</SelectItem>
                    <SelectItem value="05:30:00">05:30</SelectItem>
                    <SelectItem value="06:00:00">06:00</SelectItem>
                    <SelectItem value="06:30:00">06:30</SelectItem>
                    <SelectItem value="07:00:00">07:00</SelectItem>
                    <SelectItem value="07:30:00">07:30</SelectItem>
                    <SelectItem value="08:00:00">08:00</SelectItem>
                    <SelectItem value="08:30:00">08:30</SelectItem>
                    <SelectItem value="09:00:00">09:00</SelectItem>
                    <SelectItem value="09:30:00">09:30</SelectItem>
                    <SelectItem value="10:00:00">10:00</SelectItem>
                    <SelectItem value="10:30:00">10:30</SelectItem>
                    <SelectItem value="11:00:00">11:00</SelectItem>
                    <SelectItem value="11:30:00">11:30</SelectItem>
                    <SelectItem value="12:00:00">12:00</SelectItem>
                    <SelectItem value="12:30:00">12:30</SelectItem>
                    <SelectItem value="13:00:00">13:00</SelectItem>
                    <SelectItem value="13:30:00">13:30</SelectItem>
                    <SelectItem value="14:00:00">14:00</SelectItem>
                    <SelectItem value="14:30:00">14:30</SelectItem>
                    <SelectItem value="15:00:00">15:00</SelectItem>
                    <SelectItem value="15:30:00">15:30</SelectItem>
                    <SelectItem value="16:00:00">16:00</SelectItem>
                    <SelectItem value="16:30:00">16:30</SelectItem>
                    <SelectItem value="17:00:00">17:00</SelectItem>
                    <SelectItem value="17:30:00">17:30</SelectItem>
                    <SelectItem value="18:00:00">18:00</SelectItem>
                    <SelectItem value="18:30:00">18:30</SelectItem>
                    <SelectItem value="19:00:00">19:00</SelectItem>
                    <SelectItem value="19:30:00">19:30</SelectItem>
                    <SelectItem value="20:00:00">20:00</SelectItem>
                    <SelectItem value="20:30:00">20:30</SelectItem>
                    <SelectItem value="21:00:00">21:00</SelectItem>
                    <SelectItem value="21:30:00">21:30</SelectItem>
                    <SelectItem value="22:00:00">22:00</SelectItem>
                    <SelectItem value="22:30:00">22:30</SelectItem>
                    <SelectItem value="23:00:00">23:00</SelectItem>
                    <SelectItem value="23:30:00">23:30</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>

            <Button type="submit" disabled={upsertAppointmentsAction.isPending}>
              {upsertAppointmentsAction.isPending
                ? "Salvando..."
                : appointment
                  ? "Salvar"
                  : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertAppointmentsForm;
