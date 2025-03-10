import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, BookText, ScrollText, Users, User, BookMarkedIcon as BookmarkedIcon, Info } from "lucide-react"
import { BookCard } from "./componentes/book-card"
import { VerseHighlight } from "./componentes/verse-highlight"
import { ChapterVerseTable } from "./componentes/chapter-verse-table"
import { completeBibleData } from "./data/complete-bible-data"
import { BadgeIcon } from "lucide-react"
import { Layout } from "@/components/Loyout/Loyout"

export default function StudyBible() {
  const { oldTestament, newTestament } = completeBibleData

  return (
      <Layout>
          <div className="min-h-screen bg-slate-50 py-4 sm:py-6">
      <main className="container px-3 sm:px-4 mx-auto">
        {/* Título Principal - Mejorar tamaño de texto en móviles */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-2">
            Resumen de la Biblia: Datos Claves para el Estudio
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto">
            Una guía completa con toda la información necesaria para conocer y estudiar la estructura de la Biblia
          </p>
        </div>

        {/* Sección 1: Cantidad de Libros - Mejorar para móviles */}
        <Card className="mb-4 sm:mb-8">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <BookText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
              Cantidad de Libros en la Biblia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="p-4 sm:p-6 rounded-lg border bg-indigo-50 border-indigo-200">
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-700">66</h3>
                <p className="text-sm sm:text-base font-medium">Total de libros</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border bg-blue-50 border-blue-200">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-700">39</h3>
                <p className="text-sm sm:text-base font-medium">Antiguo Testamento</p>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border bg-green-50 border-green-200">
                <h3 className="text-xl sm:text-2xl font-bold text-green-700">27</h3>
                <p className="text-sm sm:text-base font-medium">Nuevo Testamento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 2: Clasificación de Libros - Mejorar TabsList para móviles */}
        <Card className="mb-4 sm:mb-8">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <BookmarkedIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
              Clasificación de los Libros
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Organización y división de los 66 libros de la Biblia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="antiguo">
              <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
                <TabsTrigger value="antiguo">Antiguo Testamento</TabsTrigger>
                <TabsTrigger value="nuevo">Nuevo Testamento</TabsTrigger>
              </TabsList>

              <TabsContent value="antiguo">
                <div className="grid gap-4 sm:gap-6">
                  {/* Pentateuco - Mejorar grid para móviles */}
                  <div>
                    <div className="flex flex-wrap items-center mb-3 sm:mb-4">
                      <BadgeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-blue-700 mr-2">
                        Pentateuco (Ley de Moisés)
                      </h3>
                      <Badge className="mt-1 sm:mt-0 bg-blue-100 text-blue-800">5 libros</Badge>
                    </div>
                    <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                      {oldTestament
                        .filter((book) => book.category === "Pentateuco")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Históricos - Mejorar grid para móviles */}
                  <div>
                    <div className="flex flex-wrap items-center mb-3 sm:mb-4">
                      <BadgeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-green-700 mr-2">Libros Históricos</h3>
                      <Badge className="mt-1 sm:mt-0 bg-green-100 text-green-800">12 libros</Badge>
                    </div>
                    <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                      {oldTestament
                        .filter((book) => book.category === "Históricos")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Poéticos */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-700">Libros Poéticos y de Sabiduría</h3>
                      <Badge className="ml-2 bg-purple-100 text-purple-800">5 libros</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {oldTestament
                        .filter((book) => book.category === "Poéticos")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Profetas Mayores */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-700">Profetas Mayores</h3>
                      <Badge className="ml-2 bg-red-100 text-red-800">5 libros</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {oldTestament
                        .filter((book) => book.category === "Profetas Mayores")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Profetas Menores */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-orange-600" />
                      <h3 className="text-lg font-semibold text-orange-700">Profetas Menores</h3>
                      <Badge className="ml-2 bg-orange-100 text-orange-800">12 libros</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {oldTestament
                        .filter((book) => book.category === "Profetas Menores")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nuevo">
                <div className="grid gap-6">
                  {/* Evangelios */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-indigo-700">Los Evangelios</h3>
                      <Badge className="ml-2 bg-indigo-100 text-indigo-800">4 libros</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {newTestament
                        .filter((book) => book.category === "Evangelios")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Historia */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-teal-600" />
                      <h3 className="text-lg font-semibold text-teal-700">Historia de la Iglesia Primitiva</h3>
                      <Badge className="ml-2 bg-teal-100 text-teal-800">1 libro</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {newTestament
                        .filter((book) => book.category === "Historia")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Cartas Paulinas */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-amber-600" />
                      <h3 className="text-lg font-semibold text-amber-700">Cartas Paulinas</h3>
                      <Badge className="ml-2 bg-amber-100 text-amber-800">13 libros</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {newTestament
                        .filter((book) => book.category === "Cartas Paulinas")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Cartas Generales */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-cyan-600" />
                      <h3 className="text-lg font-semibold text-cyan-700">Cartas Generales</h3>
                      <Badge className="ml-2 bg-cyan-100 text-cyan-800">8 libros</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {newTestament
                        .filter((book) => book.category === "Cartas Generales")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>

                  {/* Profecía */}
                  <div>
                    <div className="flex items-center mb-4">
                      <BadgeIcon className="h-5 w-5 mr-2 text-rose-600" />
                      <h3 className="text-lg font-semibold text-rose-700">Profecía</h3>
                      <Badge className="ml-2 bg-rose-100 text-rose-800">1 libro</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {newTestament
                        .filter((book) => book.category === "Profecía")
                        .map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sección 3: Cantidad de Capítulos y Versículos por Libro */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <ScrollText className="w-5 h-5 mr-2 text-indigo-600" />
              Cantidad de Capítulos y Versículos por Libro
            </CardTitle>
            <CardDescription>Tabla completa con todos los libros de la Biblia</CardDescription>
          </CardHeader>
          <CardContent>
            <ChapterVerseTable />
          </CardContent>
        </Card>

        {/* Sección 4: Los 4 Evangelios y sus Diferencias */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              Los 4 Evangelios y sus Diferencias
            </CardTitle>
            <CardDescription>Comparación de las características y énfasis de cada evangelio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Evangelio</TableHead>
                    <TableHead>Enfoque Principal</TableHead>
                    <TableHead>Público Destino</TableHead>
                    <TableHead>Características</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mateo</TableCell>
                    <TableCell>Jesús como Rey (Mesías)</TableCell>
                    <TableCell>Judíos</TableCell>
                    <TableCell>
                      Énfasis en el cumplimiento de las profecías del Antiguo Testamento. Incluye la genealogía de Jesús
                      desde Abraham.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marcos</TableCell>
                    <TableCell>Jesús como Siervo</TableCell>
                    <TableCell>Romanos</TableCell>
                    <TableCell>
                      El más corto y directo de los evangelios. Enfocado en las acciones de Jesús más que en sus
                      enseñanzas.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lucas</TableCell>
                    <TableCell>Jesús como Hombre</TableCell>
                    <TableCell>Griegos</TableCell>
                    <TableCell>
                      Escrito con precisión histórica. Enfatiza la humanidad de Jesús y su compasión por los marginados.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Juan</TableCell>
                    <TableCell>Jesús como Dios</TableCell>
                    <TableCell>Todo el mundo</TableCell>
                    <TableCell>
                      Muy distinto a los otros evangelios. Enfocado en la deidad de Cristo y sus discursos profundos.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-blue-600 text-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Mateo
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Para Judíos</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">
                    • Escrito por Mateo (Leví), un recaudador de impuestos convertido en apóstol.
                  </p>
                  <p className="text-sm mb-2">• Contiene más de 60 referencias al Antiguo Testamento.</p>
                  <p className="text-sm">• Enfatiza que Jesús es el Mesías prometido, el Rey de los judíos.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-red-600 text-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Marcos
                  </CardTitle>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Para Romanos</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">• Escrito por Juan Marcos, compañero de Pedro.</p>
                  <p className="text-sm mb-2">
                    • El evangelio más breve y dinámico, usa frecuentemente la palabra "inmediatamente".
                  </p>
                  <p className="text-sm">
                    • Destaca a Jesús como siervo activo, mostrando sus obras más que sus palabras.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 bg-green-50">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-green-600 text-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Lucas
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Para Griegos</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">• Escrito por Lucas, médico y compañero de Pablo.</p>
                  <p className="text-sm mb-2">• El evangelio más largo y detallado históricamente.</p>
                  <p className="text-sm">
                    • Presenta a Jesús como el hombre perfecto, destacando su humanidad y compasión.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-purple-600 text-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Juan
                  </CardTitle>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Para Todos</Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">• Escrito por Juan, "el discípulo amado".</p>
                  <p className="text-sm mb-2">
                    • Contiene los famosos "Yo soy" de Jesús (luz, pan, puerta, buen pastor, etc.).
                  </p>
                  <p className="text-sm">• Enfatiza la divinidad de Jesús como el Verbo/Palabra de Dios encarnado.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Sección 5: Autores Principales */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <Users className="w-5 h-5 mr-2 text-indigo-600" />
              Autores Principales
            </CardTitle>
            <CardDescription>Los escritores más importantes de la Biblia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Moisés
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">Escribió los primeros cinco libros de la Biblia (Pentateuco):</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Génesis</li>
                    <li>Éxodo</li>
                    <li>Levítico</li>
                    <li>Números</li>
                    <li>Deuteronomio</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    David
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">
                    Escribió la mayoría de los Salmos. En total, se le atribuyen 73 de los 150 salmos.
                  </p>
                  <p className="text-sm">Era rey de Israel, conocido como "un hombre conforme al corazón de Dios".</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Salomón
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">Escribió tres libros de sabiduría:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Proverbios (la mayoría)</li>
                    <li>Eclesiastés</li>
                    <li>Cantares</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Profetas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">
                    Cada libro profético lleva el nombre de su autor. Entre los más destacados:
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Isaías</li>
                    <li>Jeremías (también escribió Lamentaciones)</li>
                    <li>Ezequiel</li>
                    <li>Daniel</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Pablo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">Escribió 13 epístolas del Nuevo Testamento:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Romanos</li>
                    <li>1 y 2 Corintios</li>
                    <li>Gálatas, Efesios, Filipenses, Colosenses</li>
                    <li>1 y 2 Tesalonicenses</li>
                    <li>1 y 2 Timoteo, Tito, Filemón</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Otros Apóstoles
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="list-disc pl-5 text-sm">
                    <li>
                      <strong>Juan:</strong> Evangelio de Juan, 1, 2 y 3 Juan, Apocalipsis
                    </li>
                    <li>
                      <strong>Pedro:</strong> 1 y 2 Pedro
                    </li>
                    <li>
                      <strong>Mateo y Marcos:</strong> Sus respectivos evangelios
                    </li>
                    <li>
                      <strong>Lucas:</strong> Evangelio de Lucas y Hechos
                    </li>
                    <li>
                      <strong>Santiago:</strong> La epístola de Santiago
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Sección 6: Versículos Claves */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl">
              <Info className="w-5 h-5 mr-2 text-indigo-600" />
              Versículos Claves
            </CardTitle>
            <CardDescription>Pasajes bíblicos fundamentales para el estudio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <VerseHighlight
                reference="Génesis 1:1"
                text="En el principio creó Dios los cielos y la tierra."
                category="Creación"
                explanation="El primer versículo de la Biblia que establece a Dios como el Creador de todo lo que existe. Fundamental para entender el origen del universo desde la perspectiva bíblica."
              />
              <VerseHighlight
                reference="Juan 3:16"
                text="Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."
                category="Salvación"
                explanation="Considerado por muchos como 'el evangelio en miniatura'. Resume el plan de salvación de Dios y el propósito de la venida de Cristo."
              />
              <VerseHighlight
                reference="Mateo 28:19-20"
                text="Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén."
                category="Gran Comisión"
                explanation="La instrucción final de Jesús a sus discípulos, conocida como 'La Gran Comisión'. Establece la misión de la iglesia de hacer discípulos en todas las naciones."
              />
              <VerseHighlight
                reference="Hebreos 11:1"
                text="Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve."
                category="Fe"
                explanation="La definición bíblica de la fe. Este versículo inicia el capítulo conocido como 'El salón de la fe', que destaca los ejemplos de fe en el Antiguo Testamento."
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </Layout>
  )
}

