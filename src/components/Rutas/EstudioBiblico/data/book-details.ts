interface BookDetail {
    subtitle: string
    date: string
    author: string
    authorRole: string
    authorInfo: string
    summary: string
    historicalContext: string
    keyVerses: { reference: string; text: string }[]
    structure: { title: string; chapters: string; description: string }[]
    themes: { title: string; description: string }[]
    application?: string
  }
  
  const bookDetailsData: Record<string, BookDetail> = {
    genesis: {
      subtitle: "El libro de los orígenes",
      date: "1446-1406 a.C.",
      author: "Moisés",
      authorRole: "Líder de Israel, Profeta",
      authorInfo:
        "Moisés fue criado como príncipe en Egipto, pero luego huyó y se convirtió en pastor durante 40 años. Dios lo llamó para liberar a Israel de la esclavitud egipcia y recibió la Ley en el Monte Sinaí.",
      summary:
        "Génesis es el libro de los comienzos. Registra el origen del universo, la humanidad, el pecado, la muerte, los pueblos, las naciones y especialmente el inicio del plan redentor de Dios a través de la elección de Abraham y sus descendientes.",
      historicalContext:
        "Escrito durante el período en que Israel vagaba por el desierto después del Éxodo de Egipto. Cubre desde la creación hasta la muerte de José en Egipto, abarcando más de 2,000 años de historia.",
      keyVerses: [
        { reference: "Génesis 1:1", text: "En el principio creó Dios los cielos y la tierra." },
        {
          reference: "Génesis 1:27",
          text: "Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.",
        },
        {
          reference: "Génesis 12:2-3",
          text: "Y haré de ti una nación grande, y te bendeciré, y engrandeceré tu nombre, y serás bendición. Bendeciré a los que te bendijeren, y a los que te maldijeren maldeciré; y serán benditas en ti todas las familias de la tierra.",
        },
      ],
      structure: [
        {
          title: "La Creación",
          chapters: "Capítulos 1-2",
          description:
            "Dios crea el universo, la tierra y todos los seres vivos, culminando con la creación del hombre y la mujer.",
        },
        {
          title: "La Caída y sus Consecuencias",
          chapters: "Capítulos 3-5",
          description:
            "El pecado entra en el mundo, Adán y Eva son expulsados del Edén, y se narra la historia de Caín y Abel.",
        },
        {
          title: "El Diluvio",
          chapters: "Capítulos 6-9",
          description: "Dios juzga la maldad humana con un diluvio global, pero preserva a Noé y su familia.",
        },
        {
          title: "La Torre de Babel",
          chapters: "Capítulos 10-11",
          description: "Las naciones se dispersan después de la confusión de lenguas en Babel.",
        },
        {
          title: "Abraham",
          chapters: "Capítulos 12-25",
          description:
            "Dios llama a Abraham y establece un pacto con él, prometiéndole tierra, descendencia y bendición.",
        },
        {
          title: "Isaac",
          chapters: "Capítulos 25-26",
          description: "La vida de Isaac como hijo de la promesa y patriarca.",
        },
        {
          title: "Jacob",
          chapters: "Capítulos 27-36",
          description: "Jacob obtiene la bendición, huye a Harán, tiene 12 hijos y regresa a Canaán.",
        },
        {
          title: "José",
          chapters: "Capítulos 37-50",
          description:
            "José es vendido como esclavo, asciende al poder en Egipto y salva a su familia durante la hambruna.",
        },
      ],
      themes: [
        { title: "Creación", description: "Dios es el creador soberano de todo lo que existe." },
        {
          title: "Caída",
          description: "El pecado entró en el mundo por la desobediencia humana, trayendo muerte y separación de Dios.",
        },
        {
          title: "Promesa",
          description: "Dios inicia su plan de redención a través de promesas y pactos, especialmente con Abraham.",
        },
        { title: "Elección", description: "Dios elige a personas específicas para cumplir sus propósitos." },
        {
          title: "Providencia",
          description:
            "Dios dirige soberanamente los acontecimientos para cumplir sus planes, como se ve en la historia de José.",
        },
      ],
      application:
        "Génesis nos enseña sobre nuestros orígenes y propósito como seres humanos creados a imagen de Dios. Nos muestra las consecuencias del pecado pero también la fidelidad de Dios a sus promesas. A través de las vidas de los patriarcas, aprendemos sobre la fe, la obediencia y cómo Dios puede usar incluso nuestros fracasos para cumplir sus propósitos.",
    },
  
    john: {
      subtitle: "El Evangelio del Hijo de Dios",
      date: "85-95 d.C.",
      author: "Juan",
      authorRole: "Apóstol, 'el discípulo amado'",
      authorInfo:
        "Juan era pescador, hijo de Zebedeo y hermano de Santiago. Fue uno de los tres discípulos más cercanos a Jesús (junto con Pedro y Santiago). Se le conoce como 'el discípulo a quien Jesús amaba' y vivió hasta una edad avanzada, siendo el último de los apóstoles en morir.",
      summary:
        "El Evangelio de Juan tiene un enfoque único, presentando a Jesús claramente como el Hijo de Dios encarnado. A diferencia de los evangelios sinópticos, Juan incluye largos discursos de Jesús y se centra en siete señales (milagros) que demuestran su deidad. Su propósito explícito es llevar a los lectores a la fe en Cristo.",
      historicalContext:
        "Escrito hacia el final del primer siglo, cuando la iglesia enfrentaba persecución externa y herejías internas que negaban la deidad de Cristo. Juan escribió para una audiencia amplia, tanto judíos como gentiles, con el objetivo de fortalecer la fe de los creyentes y convencer a los no creyentes.",
      keyVerses: [
        {
          reference: "Juan 1:1,14",
          text: "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios... Y aquel Verbo fue hecho carne, y habitó entre nosotros.",
        },
        {
          reference: "Juan 3:16",
          text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
        },
        {
          reference: "Juan 20:30-31",
          text: "Hizo además Jesús muchas otras señales en presencia de sus discípulos, las cuales no están escritas en este libro. Pero éstas se han escrito para que creáis que Jesús es el Cristo, el Hijo de Dios, y para que creyendo, tengáis vida en su nombre.",
        },
      ],
      structure: [
        {
          title: "Prólogo: El Verbo Encarnado",
          chapters: "Capítulo 1:1-18",
          description: "Presentación de Jesús como el Verbo eterno que se hizo carne.",
        },
        {
          title: "Libro de las Señales",
          chapters: "Capítulos 1:19-12:50",
          description: "Siete milagros principales que demuestran la deidad de Jesús, junto con sus enseñanzas.",
        },
        {
          title: "Libro de la Gloria",
          chapters: "Capítulos 13-20",
          description:
            "La última cena, los discursos de despedida, la oración sacerdotal, la pasión y resurrección de Jesús.",
        },
        {
          title: "Epílogo",
          chapters: "Capítulo 21",
          description: "La aparición de Jesús resucitado junto al mar de Galilea y la restauración de Pedro.",
        },
      ],
      themes: [
        {
          title: "La Deidad de Cristo",
          description:
            "Juan enfatiza que Jesús es Dios encarnado, presentándolo como el 'Yo Soy' y atribuyéndole cualidades divinas.",
        },
        {
          title: "Vida",
          description: "Juan menciona la 'vida' más de 40 veces, mostrando que Jesús es la fuente de vida eterna.",
        },
        { title: "Luz y Tinieblas", description: "Contraste entre la luz (Cristo) y las tinieblas (el mundo sin Dios)." },
        { title: "Fe", description: "El propósito del libro es generar fe en Jesús como el Cristo, el Hijo de Dios." },
        {
          title: "El Espíritu Santo",
          description: "Juan presenta al Espíritu como el Consolador que vendría después de la partida de Jesús.",
        },
      ],
      application:
        "El Evangelio de Juan nos desafía a tomar una decisión sobre Jesús: ¿Creemos que Él es el Hijo de Dios? Si creemos, recibimos vida eterna. Juan nos invita a una relación personal con Cristo, mostrándonos que Él es el camino, la verdad y la vida. Este evangelio nos anima a vivir en la luz, amar como Jesús amó y depender del Espíritu Santo.",
    },
  
    romans: {
      subtitle: "El Evangelio de la Justicia de Dios",
      date: "57 d.C.",
      author: "Pablo",
      authorRole: "Apóstol a los gentiles",
      authorInfo:
        "Pablo (anteriormente llamado Saulo) era un fariseo educado que perseguía a los cristianos hasta su dramática conversión en el camino a Damasco. Se convirtió en el principal apóstol a los gentiles, realizando varios viajes misioneros y escribiendo 13 epístolas del Nuevo Testamento.",
      summary:
        "Romanos es la exposición más completa y sistemática del evangelio. Pablo explica cómo todos los seres humanos, tanto judíos como gentiles, son pecadores necesitados de la salvación que viene solo por la fe en Cristo. Aborda temas como la justificación, la santificación, la elección y la vida cristiana práctica.",
      historicalContext:
        "Escrita durante el tercer viaje misionero de Pablo, mientras estaba en Corinto. Pablo aún no había visitado Roma, pero planeaba hacerlo después de entregar una ofrenda en Jerusalén. La carta fue escrita para preparar a la iglesia romana para su visita y establecer claramente el evangelio que predicaba.",
      keyVerses: [
        {
          reference: "Romanos 1:16-17",
          text: "Porque no me avergüenzo del evangelio, porque es poder de Dios para salvación a todo aquel que cree; al judío primeramente, y también al griego. Porque en el evangelio la justicia de Dios se revela por fe y para fe, como está escrito: Mas el justo por la fe vivirá.",
        },
        {
          reference: "Romanos 3:23-24",
          text: "Por cuanto todos pecaron, y están destituidos de la gloria de Dios, siendo justificados gratuitamente por su gracia, mediante la redención que es en Cristo Jesús.",
        },
        {
          reference: "Romanos 8:28",
          text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
        },
      ],
      structure: [
        {
          title: "Introducción",
          chapters: "Capítulo 1:1-17",
          description: "Saludo y tema principal: el evangelio es poder de Dios para salvación.",
        },
        {
          title: "Condenación: La necesidad del evangelio",
          chapters: "Capítulos 1:18-3:20",
          description: "Todos los seres humanos, tanto gentiles como judíos, son pecadores bajo el juicio de Dios.",
        },
        {
          title: "Justificación: La provisión del evangelio",
          chapters: "Capítulos 3:21-5:21",
          description: "La justicia de Dios se recibe por fe en Cristo, no por obras de la ley.",
        },
        {
          title: "Santificación: El poder del evangelio",
          chapters: "Capítulos 6-8",
          description: "La vida cristiana victoriosa a través del Espíritu Santo.",
        },
        {
          title: "Elección: El plan del evangelio",
          chapters: "Capítulos 9-11",
          description: "La soberanía de Dios en la salvación y el futuro de Israel.",
        },
        {
          title: "Aplicación: La práctica del evangelio",
          chapters: "Capítulos 12-16",
          description: "Cómo vivir el evangelio en la iglesia, la sociedad y las relaciones personales.",
        },
      ],
      themes: [
        {
          title: "Justificación por fe",
          description: "La salvación viene solo por la fe en Cristo, no por obras o méritos humanos.",
        },
        {
          title: "Universalidad del pecado",
          description: "Todos los seres humanos son pecadores necesitados de la gracia de Dios.",
        },
        {
          title: "La gracia de Dios",
          description: "La salvación es un regalo inmerecido de Dios, no algo que podamos ganar.",
        },
        {
          title: "Nueva vida en Cristo",
          description: "Los creyentes han muerto al pecado y viven una nueva vida por el poder del Espíritu.",
        },
        {
          title: "Soberanía de Dios",
          description: "Dios es soberano en la salvación, eligiendo por gracia, no por obras previstas.",
        },
      ],
      application:
        "Romanos nos desafía a comprender profundamente el evangelio y sus implicaciones. Nos enseña que la salvación es por gracia mediante la fe, no por obras. Nos llama a vivir vidas transformadas por el poder del Espíritu, presentando nuestros cuerpos como sacrificios vivos. La carta nos anima a vivir en armonía con otros creyentes, someternos a las autoridades y amar a nuestro prójimo como a nosotros mismos.",
    },
  
    revelation: {
      subtitle: "La Revelación de Jesucristo",
      date: "95-96 d.C.",
      author: "Juan",
      authorRole: "Apóstol, exiliado en Patmos",
      authorInfo:
        "Juan, el mismo autor del Evangelio de Juan y las epístolas de Juan, recibió esta revelación mientras estaba exiliado en la isla de Patmos por su testimonio de Jesucristo. Era el último apóstol vivo en este momento.",
      summary:
        "Apocalipsis es el único libro profético del Nuevo Testamento. Revela eventos futuros a través de visiones simbólicas, culminando con el regreso de Cristo, el juicio final y la creación de un nuevo cielo y una nueva tierra. El libro ofrece esperanza a los creyentes que enfrentan persecución, asegurándoles la victoria final de Cristo sobre el mal.",
      historicalContext:
        "Escrito durante el reinado del emperador Domiciano, cuando los cristianos enfrentaban intensa persecución por negarse a adorar al emperador. Las siete iglesias de Asia Menor (actual Turquía) a las que se dirige el libro estaban experimentando diversos desafíos espirituales y persecución.",
      keyVerses: [
        {
          reference: "Apocalipsis 1:7-8",
          text: "He aquí que viene con las nubes, y todo ojo le verá, y los que le traspasaron; y todos los linajes de la tierra harán lamentación por él. Sí, amén. Yo soy el Alfa y la Omega, principio y fin, dice el Señor, el que es y que era y que ha de venir, el Todopoderoso.",
        },
        {
          reference: "Apocalipsis 5:9-10",
          text: "Y cantaban un nuevo cántico, diciendo: Digno eres de tomar el libro y de abrir sus sellos; porque tú fuiste inmolado, y con tu sangre nos has redimido para Dios, de todo linaje y lengua y pueblo y nación; y nos has hecho para nuestro Dios reyes y sacerdotes, y reinaremos sobre la tierra.",
        },
        {
          reference: "Apocalipsis 21:4",
          text: "Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor; porque las primeras cosas pasaron.",
        },
      ],
      structure: [
        {
          title: "Prólogo y Visión de Cristo",
          chapters: "Capítulo 1",
          description: "Introducción y visión de Cristo glorificado.",
        },
        {
          title: "Cartas a las Siete Iglesias",
          chapters: "Capítulos 2-3",
          description: "Mensajes específicos de Cristo a siete iglesias de Asia Menor.",
        },
        {
          title: "Visiones del Cielo y los Sellos",
          chapters: "Capítulos 4-7",
          description: "El trono de Dios, el Cordero y la apertura de los siete sellos.",
        },
        {
          title: "Las Siete Trompetas",
          chapters: "Capítulos 8-11",
          description: "Juicios anunciados por siete trompetas.",
        },
        {
          title: "Conflicto Cósmico",
          chapters: "Capítulos 12-14",
          description: "La mujer, el dragón, las bestias y el Cordero.",
        },
        { title: "Las Siete Copas", chapters: "Capítulos 15-16", description: "Los últimos juicios de la ira de Dios." },
        {
          title: "La Caída de Babilonia",
          chapters: "Capítulos 17-18",
          description: "Juicio sobre el sistema mundial corrupto.",
        },
        {
          title: "El Triunfo Final de Cristo",
          chapters: "Capítulos 19-20",
          description: "El regreso de Cristo, el milenio y el juicio final.",
        },
        {
          title: "La Nueva Creación",
          chapters: "Capítulos 21-22",
          description: "El nuevo cielo, la nueva tierra y la Nueva Jerusalén.",
        },
      ],
      themes: [
        {
          title: "La soberanía de Dios",
          description: "Dios está en control de la historia y llevará sus planes a su cumplimiento final.",
        },
        {
          title: "El triunfo de Cristo",
          description: "Jesús es presentado como el Cordero victorioso que vence a todos sus enemigos.",
        },
        {
          title: "Perseverancia en la fe",
          description: "Los creyentes son llamados a mantenerse fieles a pesar de la persecución.",
        },
        { title: "Juicio y redención", description: "Dios juzgará el mal pero redimirá a su pueblo fiel." },
        {
          title: "Esperanza futura",
          description: "La promesa de un nuevo cielo y una nueva tierra donde Dios habitará con su pueblo.",
        },
      ],
      application:
        "Apocalipsis nos anima a permanecer fieles a Cristo en medio de la persecución y las dificultades. Nos recuerda que Dios está en control de la historia y que Cristo triunfará finalmente sobre todo mal. El libro nos da esperanza en la promesa de la nueva creación, donde viviremos eternamente con Dios, libres de todo sufrimiento y dolor. Nos llama a vivir con una perspectiva eterna, sabiendo que nuestras luchas actuales son temporales.",
    },
  }
  
  // Función para obtener los detalles de un libro específico
  export function getBookDetails(bookId: string): BookDetail {
    // Si el libro existe en nuestros datos detallados, devuélvelo
    if (bookDetailsData[bookId]) {
      return bookDetailsData[bookId]
    }
  
    // Si no tenemos datos detallados para este libro, devuelve datos genéricos
    return {
      subtitle: "Libro de la Biblia",
      date: "Fecha desconocida",
      author: "Autor bíblico",
      authorRole: "Escritor inspirado por Dios",
      authorInfo:
        "Este autor fue elegido por Dios para escribir este libro de la Biblia bajo la inspiración del Espíritu Santo.",
      summary:
        "Este libro forma parte del canon bíblico y contiene enseñanzas importantes para la fe y la práctica cristiana.",
      historicalContext: "Escrito en el contexto histórico de la revelación progresiva de Dios a su pueblo.",
      keyVerses: [{ reference: "Versículo clave", text: "Texto del versículo clave de este libro." }],
      structure: [
        {
          title: "Introducción",
          chapters: "Primeros capítulos",
          description: "Presentación de los temas principales del libro.",
        },
        {
          title: "Desarrollo",
          chapters: "Capítulos intermedios",
          description: "Desarrollo de las enseñanzas y narrativas principales.",
        },
        {
          title: "Conclusión",
          chapters: "Capítulos finales",
          description: "Cierre y aplicación de las enseñanzas del libro.",
        },
      ],
      themes: [
        { title: "Tema Principal", description: "Este libro aborda temas importantes para la fe y la vida cristiana." },
        { title: "Enseñanzas Clave", description: "Contiene enseñanzas fundamentales para entender el plan de Dios." },
      ],
      application:
        "Este libro nos enseña importantes lecciones sobre Dios, la fe y cómo vivir como creyentes. Sus enseñanzas siguen siendo relevantes para los cristianos de hoy.",
    }
  }
  
  