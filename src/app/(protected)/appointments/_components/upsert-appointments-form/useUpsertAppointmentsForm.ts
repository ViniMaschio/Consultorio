import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { upsertAppointments } from "@/actions/appointments/upsert-appointments";
import { getAvailability } from "@/app/(protected)/doctors/_components/doctors-card/_helpers/availability";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

const formSchema = z.object({
  id: z.string().optional(),
  date: z
    .date({
      required_error: "Selecione uma data",
      invalid_type_error: "Data inválida",
    })
    .min(startOfToday(), "A data não pode ser anterior a hoje"),
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

const useUpsertAppointmentsForm = ({
  onSuccess,
  appointment,
  doctors,
  isOpen,
}: UpsertAppointmentsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: appointment?.id || undefined,
      date: appointment?.date || undefined,
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

  function generateTimeSlots(from: string, to: string): string[] {
    const slots: string[] = [];

    const [fromHour, fromMinute] = from.split(":").map(Number);
    const [toHour, toMinute] = to.split(":").map(Number);

    const fromDate = new Date();
    fromDate.setHours(fromHour, fromMinute, 0, 0);

    const toDate = new Date();
    toDate.setHours(toHour, toMinute, 0, 0);

    while (fromDate <= toDate) {
      const hours = fromDate.getHours().toString().padStart(2, "0");
      const minutes = fromDate.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      fromDate.setMinutes(fromDate.getMinutes() + 30);
    }

    return slots;
  }

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");

  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
      if (selectedDoctor) {
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );

        const { from, to } = getAvailability(selectedDoctor);

        const times = generateTimeSlots(
          from.format("HH:mm"),
          to.format("HH:mm"),
        );
        setAvailableTimes(times);

        form.setValue("time", "");
      }
    } else {
      setAvailableTimes([]);
      form.setValue("time", "");
    }
  }, [selectedDoctorId, doctors, form]);
  return {
    formSchema,
    form,
    upsertAppointmentsAction,
    onSubmit,
    availableTimes,
    open,
    setOpen,
    selectedDoctorId,
    selectedPatientId,
  };
};
export default useUpsertAppointmentsForm;
