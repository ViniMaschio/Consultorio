import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

export const authenticationSchema = z.object({
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
  const router = useRouter();
  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof authenticationSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          if (ctx.error.code === "USER_ALREADY_EXIST") {
            toast.error("Email já cadastrado");
            return;
          }
          toast.error("Erro ao criar conta");
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
