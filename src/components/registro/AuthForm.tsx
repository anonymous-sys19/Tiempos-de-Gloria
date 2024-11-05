import  { useState } from 'react'
import { useAuth } from '@/hooks/userAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await signIn(email, password)
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de vuelta!",
        })
      } else {
        await signUp(email, password, username)
        toast({
          title: "Registro exitoso",
          description: "Por favor, verifica tu email para completar el registro.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error",
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión con Google.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Ingresa tus credenciales para acceder'
            : 'Crea una nueva cuenta para comenzar'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
          <TabsList className="grid w-full grid-cols-2">
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
              <Button className="w-full mt-4" type="submit">Iniciar Sesión</Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    placeholder="usuario123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
              <Button className="w-full mt-4" type="submit">Registrarse</Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Botón para iniciar sesión con Google */}
        <Button className="w-full mt-4" variant="outline" onClick={handleGoogleSignIn}>
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
  )
}

export default AuthForm