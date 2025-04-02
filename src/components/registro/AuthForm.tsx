import { useState } from "react";
import { useAuth } from "@/data/hooks/userAuth";
import { toast } from "@/data/hooks/use-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de vuelta!",
        });
      } else {
        await signUp(email, password, fullname);
        toast({
          title: "Registro exitoso",
          description:
            "Por favor, verifica tu email para completar el registro.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión con Google.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Lado de la imagen */}
      <div className="lg:flex-1 bg-blue-600 flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center lg:text-left">
          <img
            src="/logo-idec.png"
            alt="Logo"
            className=" mx-auto lg:mx-0 mb-8 w-48 h-48 object-scale-down rounded-img-person"
          />
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Bienvenido
          </h1>
          <p className="text-xl text-blue-100">
            Conéctate con nosotros y descubre un mundo de posibilidades.
          </p>
        </div>
      </div>

      {/* Lado del formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isLogin ? "Iniciar Sesión" : "Registrarse"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Ingresa tus credenciales para acceder"
                : "Crea una nueva cuenta para comenzar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={isLogin ? "login" : "register"}
              onValueChange={(value) => setIsLogin(value === "login")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="nombre@ejemplo.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSubmit}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="fullname">Nombre Completo</Label>
                      <Input
                        id="fullname"
                        placeholder="nombre apellido"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="nombre@ejemplo.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Registrarse
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Botón para iniciar sesión con Google */}
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={handleGoogleSignIn}
            >
              Iniciar sesión con Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
              <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
