import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { User, Users, HandHeart, Music, Baby, Sparkles, Heart, Briefcase, Laptop, BookOpen } from "lucide-react"
import { Layout } from "@/components/Loyout/Loyout"

export default function SeUnLider() {
  return (
    <Layout>
       <div className="w-full mx-auto bg-white dark:bg-slate-950 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          LIDERAZGO EN LA IGLESIA SEGÚN LA BIBLIA
        </h1>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)] p-4 md:p-6">
        <div className="space-y-8">
          {/* Pastor Section */}
          <LeadershipSection
            number="1"
            title="EL PASTOR"
            subtitle="Funciones y Responsabilidades"
            icon={<User className="h-6 w-6" />}
            description="El pastor es el principal líder espiritual de la iglesia y su rol está claramente definido en la Biblia."
            responsibilities={[
              {
                text: "Guía espiritual: Apacienta y cuida de la congregación.",
                reference: "Juan 10:11, 1 Pedro 5:2-3",
              },
              {
                text: "Predicador y maestro: Debe instruir en la sana doctrina.",
                reference: "2 Timoteo 4:2, Tito 1:9",
              },
              { text: "Ejemplo a seguir: Su vida debe ser intachable.", reference: "1 Timoteo 3:1-7, Tito 1:6-9" },
              { text: "Administrador y organizador: Dirige y supervisa la iglesia.", reference: "Hechos 20:28" },
              { text: "Intercesor: Ora por la iglesia.", reference: "Efesios 6:18, 1 Tesalonicenses 5:17" },
            ]}
          />

          {/* Elders Section */}
          <LeadershipSection
            number="2"
            title="ANCIANOS O LÍDERES ESPIRITUALES"
            subtitle="Funciones y Responsabilidades"
            icon={<Users className="h-6 w-6" />}
            responsibilities={[
              {
                text: "Aconsejar y guiar: Ayudan en la dirección de la iglesia.",
                reference: "Santiago 5:14, Hechos 14:23",
              },
              {
                text: "Mantener la sana doctrina: Se aseguran de que la iglesia se mantenga fiel a la Palabra.",
                reference: "Tito 1:5-9",
              },
              { text: "Ejemplo de vida: Son modelos de fe y conducta.", reference: "1 Pedro 5:3" },
            ]}
          />

          {/* Deacons Section */}
          <LeadershipSection
            number="3"
            title="DIÁCONOS"
            subtitle="Funciones y Responsabilidades"
            icon={<HandHeart className="h-6 w-6" />}
            responsibilities={[
              {
                text: "Servicio en la iglesia: Atienden las necesidades físicas de la congregación.",
                reference: "Hechos 6:1-6",
              },
              {
                text: "Asistencia a los más necesitados: Velan por viudas, huérfanos y necesitados.",
                reference: "1 Timoteo 3:8-13",
              },
              { text: "Colaboración con el pastor: Ayudan en el ministerio según sea necesario." },
            ]}
          />

          {/* Worship Ministry Section */}
          <LeadershipSection
            number="4"
            title="MINISTERIO DE ALABANZA Y ADORACIÓN"
            subtitle="Funciones y Responsabilidades"
            icon={<Music className="h-6 w-6" />}
            responsibilities={[
              {
                text: "Liderar la iglesia en la adoración: Debe ser guiado por el Espíritu Santo.",
                reference: "Salmo 150:1-6, Juan 4:23-24",
              },
              {
                text: "Vivir en santidad: Su vida debe reflejar una relación íntima con Dios.",
                reference: "Salmo 33:3",
              },
              {
                text: "Preparación musical y espiritual: Deben estudiar la música y la Palabra de Dios.",
                reference: "Colosenses 3:16",
              },
            ]}
          />

          {/* Children's Ministry Section */}
          <LeadershipSection
            number="5"
            title="MINISTERIO DE NIÑOS"
            subtitle="Funciones y Responsabilidades"
            icon={<Baby className="h-6 w-6" />}
            responsibilities={[
              {
                text: "Enseñar la Palabra de Dios: Formar a los niños en el temor del Señor.",
                reference: "Proverbios 22:6",
              },
              {
                text: "Crear un ambiente seguro y espiritual: Instrucción basada en principios bíblicos.",
                reference: "Mateo 19:14",
              },
              {
                text: "Dar ejemplo de vida: Los niños aprenden más con el testimonio.",
                reference: "Deuteronomio 6:6-7",
              },
            ]}
          />

          {/* Youth Ministry Section */}
          <LeadershipSection
            number="6"
            title="MINISTERIO DE JÓVENES Y ADOLESCENTES"
            subtitle="Funciones y Responsabilidades"
            icon={<Sparkles className="h-6 w-6" />}
            responsibilities={[
              {
                text: "Formación en la fe: Enseñarles a fundamentar su vida en la Palabra.",
                reference: "Eclesiastés 12:1, 1 Timoteo 4:12",
              },
              {
                text: "Fomentar la santidad y la disciplina: Ayudarles a mantenerse firmes.",
                reference: "2 Timoteo 2:22",
              },
              { text: "Crear espacios de comunidád y discipulado.", reference: "Hechos 2:42-47" },
            ]}
          />

          {/* Women's Ministry Section */}
          <LeadershipSection
            number="7"
            title="MINISTERIO DE DAMAS"
            subtitle="Funciones y Responsabilidades"
            icon={<Heart className="h-6 w-6" />}
            responsibilities={[
              { text: "Enseñar a otras mujeres: Educar en piedad y amor familiar.", reference: "Tito 2:3-5" },
              { text: "Ser modelo de vida cristiana.", reference: "1 Pedro 3:3-4" },
              { text: "Fomentar la unidad y la oración.", reference: "1 Tesalonicenses 5:11" },
            ]}
          />

          {/* Men's Ministry Section */}
          <LeadershipSection
            number="8"
            title="MINISTERIO DE CABALLEROS"
            subtitle="Funciones y Responsabilidades"
            icon={<Briefcase className="h-6 w-6" />}
            responsibilities={[
              { text: "Fomentar el liderazgo y la espiritualidad.", reference: "1 Corintios 16:13, Josué 1:9" },
              { text: "Apoyar a la iglesia en sus necesidades." },
              { text: "Modelar una vida de integridad y compromiso.", reference: "Efesios 5:25" },
            ]}
          />

          {/* Multimedia Ministry Section */}
          <LeadershipSection
            number="9"
            title="MINISTERIO DE MULTIMEDIA Y TECNOLOGÍA"
            subtitle="Funciones y Responsabilidades"
            icon={<Laptop className="h-6 w-6" />}
            responsibilities={[
              { text: "Usar la tecnología para la expansión del evangelio.", reference: "Mateo 28:19-20" },
              { text: "Mantener la excelencia en la comunicación." },
              { text: "Servir con humildad y compromiso.", reference: "Colosenses 3:23" },
            ]}
          />

          {/* Conclusion */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                CONCLUSIÓN
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                El liderazgo en la iglesia debe estar basado en la Palabra de Dios, con el objetivo de glorificar a
                Cristo y edificar a su pueblo. Cada ministerio cumple un papel fundamental en la obra de Dios y debe ser
                ejercido con responsabilidad, humildad y amor.
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
   </Layout>
  )
}

interface Responsibility {
  text: string
  reference?: string
}

interface LeadershipSectionProps {
  number: string
  title: string
  subtitle: string
  icon: React.ReactNode
  description?: string
  responsibilities: Responsibility[]
}

function LeadershipSection({ number, title, subtitle, icon, description, responsibilities }: LeadershipSectionProps) {
  return (
    <Card className="border-blue-100 dark:border-blue-950 overflow-hidden">
      <div className="bg-blue-50 dark:bg-blue-950/50 p-4 flex items-center gap-3">
        <div className="bg-blue-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300">{title}</h2>
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">{subtitle}</h3>
        </div>
        <div className="ml-auto text-blue-600 dark:text-blue-400">{icon}</div>
      </div>

      <CardContent className="p-4">
        {description && <p className="mb-3 text-gray-700 dark:text-gray-300">{description}</p>}

        <ul className="space-y-2">
          {responsibilities.map((item, index) => (
            <li key={index} className="flex flex-col">
              <span className="text-gray-800 dark:text-gray-200">{item.text}</span>
              {item.reference && (
                <span className="text-sm text-blue-600 dark:text-blue-400 italic">({item.reference})</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

