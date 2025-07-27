import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
//import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createClinicAction } from "@/actions/clinics/create-clinic";

export const formNewClinicSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatorio" }),
});

export function useFormNewClinic() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formNewClinicSchema>>({
    resolver: zodResolver(formNewClinicSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formNewClinicSchema>) {
    try {
      await createClinicAction(values.name);
      toast.success("Clinica criada com sucesso");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating clinic:", error);
      toast.error("Erro ao criar clinica");
    }
  }

  return { form, onSubmit };
}
