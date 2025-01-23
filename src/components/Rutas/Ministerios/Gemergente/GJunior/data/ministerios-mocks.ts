// Datos de prueba para ministerios
export const ministeriosMock = [
    {
      id: '1',
      nombre: 'Ministerio GEmergente',
      descripcion: 'Desarrollo de programas y políticas emergentes para la juventud',
      imagen: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
      publicaciones: [
        {
          id: '1',
          tipo: 'imagen',
          titulo: 'Nueva sede ministerial',
          contenido: 'Inauguración de nuestras nuevas instalaciones en el centro de la ciudad',
          mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          fecha: '2024-03-20',
          likes: 125,
          comentarios: 23,
          compartidos: 15
        },
        {
          id: '2',
          tipo: 'pdf',
          titulo: 'Plan Estratégico 2024',
          contenido: 'Documento oficial del plan estratégico anual',
          mediaUrl: '/documentos/plan.pdf',
          fecha: '2024-03-18',
          likes: 45,
          comentarios: 8,
          compartidos: 12
        },
        {
          id: '3',
          tipo: 'video',
          titulo: 'Resumen del primer trimestre',
          contenido: 'Video resumen de las actividades realizadas',
          mediaUrl: 'https://janbrtgwtomzffqqcmfo.supabase.co/storage/v1/object/public/idec-public/videos/Video_Primicia.mp4?t=2024-11-30T05%3A49%3A18.554Z',
          thumbnailUrl: 'https://janbrtgwtomzffqqcmfo.supabase.co/storage/v1/object/public/idec-public/videos/Video_Primicia.mp4?t=2024-11-30T05%3A49%3A18.554Z',
          fecha: '2024-03-15',
          likes: 89,
          comentarios: 15,
          compartidos: 7
        }
      ]
    },
    {
      id: '2',
      nombre: 'Ministerio de Desarrollo Social',
      descripcion: 'Promoviendo el bienestar y desarrollo de la comunidad',
      imagen: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60',
      publicaciones: [
        {
          id: '4',
          tipo: 'imagen',
          titulo: 'Programa Comunitario',
          contenido: 'Lanzamiento del nuevo programa de apoyo comunitario',
          mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
          fecha: '2024-03-19',
          likes: 234,
          comentarios: 45,
          compartidos: 28
        }
      ]
    }
  ];