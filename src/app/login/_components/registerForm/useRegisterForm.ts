import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é obrigatorio" }).max(50),
  emailRegister: z
    .string()
    .trim()
    .min(2, { message: "Email é obrigatorio" })
    .email({ message: "Email é Invalido" }),
  passwordRegister: z
    .string()
    .trim()
    .min(6, { message: "Senha deve conter 6 letras" })
    .max(100),
});

export function useRegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      emailRegister: "",
      passwordRegister: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    authClient.signUp.email(
      {
        email: values.emailRegister,
        password: values.passwordRegister,
        name: values.name,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Email já cadastrado");
        },
      },
    );
  }

  return {
    form,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
    onSubmit,
  };
}
