import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import { AuthenticationForm } from "./_components/authenticationForm";
import { RegisterForm } from "./_components/registerForm";

const LoginPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login">
        <TabsList className="min-w-[400px] items-center justify-center">
          <TabsTrigger value="login">login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="min-w-[400px]">
          <Card>
            <AuthenticationForm></AuthenticationForm>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="min-w-[400px]">
          <Card>
            <RegisterForm></RegisterForm>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;
