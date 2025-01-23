import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"
import { Layout } from "@/components/Loyout/Loyout"

const principles = [
    {
        id: 1,
        title: "EJEMPLO ESPIRITUAL",
        description: "Demostraremos nuestro compromiso con Cristo al poner en práctica las disciplinas espirituales; demostraremos nuestra dedicación al cuerpo de Cristo siendo leales a Dios y a su Iglesia y a la obra de Cristo al ser buenos administradores.",
        content: [
            "La práctica de las disciplinas espirituales",
            "Lealtad a Dios y dedicación a la iglesia",
            "Buena mayordomía cristiana"
        ]
    },
    {
        id: 2,
        title: "PUREZA MORAL",
        description: "Participaremos en toda actividad que glorifique a Dios en nuestro cuerpo y evitaremos satisfacer los deseos de la carne. Leeremos, miraremos y escucharemos todo lo que sea de beneficio para nuestra vida espiritual.",
        content: [
            "Debemos glorificar a Dios en nuestro cuerpo",
            "Lo que leemos, miramos y escuchamos",
            "Fomento del bienestar espiritual"
        ]
    },
    {
        id: 3,
        title: "INTEGRIDAD PERSONAL",
        description: "Viviremos una vida que inspire responsabilidad y confianza, que produzca el fruto del Espíritu y manifieste el carácter de Cristo en toda nuestra conducta.",
        content: [
            "Responsabilidad y confianza",
            "Fruto del Espíritu",
            "El carácter de Cristo"
        ]
    },
    {
        id: 4,
        title: "RESPONSABILIDAD CON LA FAMILIA",
        description: "Daremos prioridad al cumplimiento de las responsabilidades familiares, preservaremos la santidad del matrimonio y mantendremos el orden bíblico en el hogar.",
        content: [
            "La prioridad de la familia",
            "La santidad del matrimonio",
            "Orden divino en el hogar"
        ]
    },
    {
        id: 5,
        title: "TEMPLANZA EN LA CONDUCTA",
        description: "Practicaremos la templanza en la conducta y evitaremos actitudes y actos ofensivos contra nuestros semejantes o que conduzcan a la adicción o esclavitud a las drogas.",
        content: [
            "Templanza",
            "Conducta ofensiva",
            "Adicción y esclavitud"
        ]
    },
    {
        id: 6,
        title: "APARIENCIA MODESTA",
        description: "Demostraremos el principio bíblico de la modestia vistiendo y luciendo de una manera que realce nuestro testimonio cristiano y evite el orgullo, la presunción y la sensualidad.",
        content: [
            "Modestia",
            "Apariencia y vestido",
            "Orgullo, presunción y sensualidad"
        ]
    },
    {
        id: 7,
        title: "OBLIGACIONES SOCIALES",
        description: "Nuestro objetivo será cumplir con las obligaciones que tenemos hacia la sociedad, siendo buenos ciudadanos, corrigiendo las injusticias sociales y protegiendo la santidad de la vida.",
        content: [
            "Ser buenos ciudadanos",
            "Corregir la injusticia social",
            "Proteger la integridad de la vida"
        ]
    }
]

export function PrincipiosPracticos() {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col ">
                {/* Hero section with logo-inspired colors */}
                <div className="flex-grow flex items-center justify-center dark:bg-gray-800 dark:text-white bg-gradient-to-br from-[#000080] to-[#000080]/90 text-white p-4 " >
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="w-32 h-32 mx-auto mb-8">
                            {/* <img
              src="/logo-idec.png"
              alt="Logo"
              className="w-full h-full object-contain"
            /> */}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4">Principios Prácticos</h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-200">Guías para una vida cristiana íntegra</p>
                        <ChevronDown className="w-10 h-10 mx-auto animate-bounce text-gray-300" />
                    </div>
                </div>

                {/* Content section */}
                <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-800 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {principles.map((principle) => (
                            <Card
                                key={principle.id}
                                className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border-[#000080]/10 "
                            >
                                <CardHeader className="bg-[#000080] text-white dark:bg-gray-800 dark:text-white">
                                    <CardTitle className="text-xl font-semibold">{principle.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col p-4 dark:bg-gray-800 ">
                                    <CardDescription className="text-sm mb-4 flex-grow text-gray-600 dark:text-gray-300">
                                        {principle.description}
                                    </CardDescription>
                                    <Tabs defaultValue={principle.content[0]} className="w-full">
                                        <TabsList className="grid w-full grid-cols-3 mb-2 bg-gray-100">
                                            {principle.content.map((item, index) => (
                                                <TabsTrigger
                                                    key={index}
                                                    value={item}
                                                    className="text-xs py-1 px-2 dark:bg-slate-950 data-[state=active]:bg-[#000080] data-[state=active]:text-white"
                                                >
                                                    {index + 1}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {principle.content.map((item, index) => (
                                            <TabsContent key={index} value={item} className="mt-2">
                                                <ScrollArea className="h-24 rounded-md border border-[#000080]/10 p-2">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                                                </ScrollArea>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

