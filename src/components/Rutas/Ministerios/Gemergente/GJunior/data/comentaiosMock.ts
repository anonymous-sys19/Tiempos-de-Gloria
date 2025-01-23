export const comentariosMock = {
    '1': [
      {
        id: '1',
        publicacionId: '1',
        usuarioId: 'user1',
        usuario: {
          nombre: 'María García',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        },
        contenido: '¡Excelentes instalaciones! Felicitaciones por este gran avance.',
        createdAt: '2024-03-20T15:30:00Z',
        likes: 12,
        respuestas: [
          {
            id: 'resp1',
            comentarioId: '1',
            usuarioId: 'user2',
            usuario: {
              nombre: 'Juan Pérez',
              avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
            },
            contenido: 'Totalmente de acuerdo, son muy modernas.',
            createdAt: '2024-03-20T16:00:00Z',
            likes: 5,
          }
        ]
      },
      {
        id: '2',
        publicacionId: '1',
        usuarioId: 'user3',
        usuario: {
          nombre: 'Carlos Rodríguez',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        },
        contenido: '¿Cuándo comenzarán las actividades en la nueva sede?',
        createdAt: '2024-03-20T17:15:00Z',
        likes: 8,
        respuestas: []
      }
    ]
  };