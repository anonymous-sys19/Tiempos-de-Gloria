import { Layout } from "@/components/Loyout/Loyout"
import { ImageCard } from "./image-card"

export function FaithDeclaration() {
    const beliefs = [
        {
            id: 1,
            text: "En la inspiración verbal de la Biblia.",
            image: "https://wallpapercave.com/uwp/uwp4348358.jpeg?height=400&width=600",
        },
        {
            id: 2,
            text: "En un Dios que existe eternamente en tres personas, a saber: el Padre, el Hijo y el Espíritu Santo.",
            image: "/placeholder.svg?height=400&width=600",
        },
        {
            id: 3,
            text: "Que Jesucristo es el unigénito del Padre, concebido del Espíritu Santo y nacido de la virgen María. Que fue crucificado, sepultado y resucitó de entre los muertos. Que ascendió al cielo y está hoy a la diestra del Padre como nuestro Intercesor.",
            image: "/placeholder.svg?height=400&width=600",
        },
        {
            id: 4,
            text: "Que todos han pecado y han sido destituidos de la gloria de Dios, y que el arrepentimiento es ordenado por Dios para todos y necesario para el perdón de los pecados.",
            image: "/placeholder.svg?height=400&width=600",
        },
        {
            id: 5,
            text: "Que la justificación, la regeneración y el nuevo nacimiento se efectúan por fe en la sangre de Jesucristo.",
            image: "/placeholder.svg?height=400&width=600",
        },
        {
            id: 6,
            text: "En la santificación, siguiente al nuevo nacimiento, por fe en la sangre de Jesucristo, por medio de la Palabra y por el Espíritu Santo.",
            image: "/placeholder.svg?height=400&width=600",
        },
    ]

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-4xl font-bold text-primary mb-8">DECLARACIÓN DE FE</h1>

                <div className="prose prose-lg max-w-none mb-16">
                    <p className="text-muted-foreground mb-6">
                        Breve reseña histórica: El 7 de enero se conmemoró en toda la Iglesia de Dios Internacional, el 70 aniversario de nuestra DECLARACIÓN DE FE. 1948, durante la cuadragésima tercera Asamblea General (en Providence, Alabama), se nombró a un comité para que trabajara dicha declaración de fe, para la Iglesia de Dios.En 292 palabras (en el idioma español) y 14 declaraciones, se plasmaron los artículos que darían dirección al sistema doctrinal de nuestra iglesia.
                    </p>

                    <p className="text-muted-foreground mb-6">
                        La Iglesia de Dios cree y sostiene la Biblia completa, debidamente trazada. El Nuevo Testamento es su única regla de gobierno y disciplina. La Iglesia de Dios ha adoptado la siguiente Declaración de Fe como el estándares oficial de su doctrina.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">Creemos:</h2>

                    <div className="space-y-4">
                        {beliefs.map((belief) => (
                            <div key={belief.id} className="flex gap-2">
                                <span className="font-semibold">{belief.id}.</span>
                                <p>{belief.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Downloadable Image Cards Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold mb-8 text-center">
                        Versión para Descargar e Imprimir
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {beliefs.map((belief, index) => (
                            <ImageCard
                                key={belief.id}
                                text={belief.text}
                                backgroundUrl={belief.image}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

