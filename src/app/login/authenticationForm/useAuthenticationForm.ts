import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const authenticationSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é Obrigatorio" }),
  email: z
    .string()
    .trim()
    .min(2, { message: "Email é obrigatorio" })
    .email({ message: "Email é Invalido" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Senha deve conter 6 letras" })
    .max(100),
});

export function useAuthenticationForm() {
  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values: z.infer<typeof authenticationSchema>) {
    console.log(values);
  }

  return {
    form,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
    onSubmit,
  };
}
