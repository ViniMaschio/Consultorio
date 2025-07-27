"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientsTable } from "@/db/schema";

import { useUpsertPatientForm } from "./useUpsertPatientForm";

interface UpsertPatientFormProps {
  onSuccess?: () => void;
  patient?: typeof patientsTable.$inferSelect;
}

export const UpsertPatientForm = ({
  onSuccess,
  patient,
}: UpsertPatientFormProps) => {
  const { form, onSubmit, upsertPatientAction } = useUpsertPatientForm({
    onSuccess,
    patient,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient ? patient.name : "Adicionar Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite os dados desse paciente"
            : "Preencha os dados do paciente"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do paciente" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email do paciente" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => {
              const formatPhone = (value: string) => {
                const digits = value.replace(/\D/g, "").slice(0, 11);
                const match = digits.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
                if (!match) return value;
                const [, ddd, part1, part2] = match;
                if (part2) return `(${ddd}) ${part1}-${part2}`;
                if (part1) return `(${ddd}) ${part1}`;
                if (ddd) return `(${ddd}`;
                return "";
              };

              return (
                <FormItem>
                  <FormLabel>Número de Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="(00) 00000-0000"
                      onChange={(e) => {
                        const masked = formatPhone(e.target.value);
                        field.onChange(masked);
                      }}
                      value={formatPhone(field.value || "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>

            <Button type="submit" disabled={upsertPatientAction.isPending}>
              {upsertPatientAction.isPending
                ? "Salvando..."
                : patient
                  ? "Salvar"
                  : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
