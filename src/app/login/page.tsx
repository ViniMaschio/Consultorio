import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AuthenticationForm } from "./authenticationForm";
import { RegisterForm } from "./registerForm";

export default function LoginPage() {
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
}
