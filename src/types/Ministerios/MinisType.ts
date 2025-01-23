export type MinisterioTipo = 'GEmergente' | 'GEJunior' | 'MinisterioDamas' | 'Caballeros';

export interface Ministerio {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  tipo: MinisterioTipo;
  imagen: string;
  activo: boolean;
  createdAt: string;
}

export type PublicacionTipo = 'pdf' | 'imagen' | 'video' ;

export interface Publicacion {
  id: string;
  ministerioId: string;
  tipo: PublicacionTipo;
  contenido: string;
  titulo: string;
  descripcion?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  likes: number;
  comentarios: number;
  compartidos: number;
}