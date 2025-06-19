import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatorio" }).max(50),
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

export function useRegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(values);
  }

  return {
    form,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
    onSubmit,
  };
}
