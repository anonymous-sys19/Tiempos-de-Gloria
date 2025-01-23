export interface SermonType {
    id: string;
    tema: string;
    pasaje: string;
    contenido: string;
    hashtags: string[];
    bosquejo: {
      introduccion: {
        texto: string;
        contexto: string;
      };
      puntos: Array<{
        titulo: string;
        contexto: string;
        subpuntos: Array<{
          texto: string;
          contexto: string;
        }>;
      }>;
      conclusion: {
        texto: string;
        contexto: string;
      };
    };
  }