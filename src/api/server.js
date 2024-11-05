import express from "express";
import request  from "request";
import cors from "cors";

const app = express();
const PORT = 3002;

// Habilitar CORS para todas las rutas
app.use(cors());

// Ruta para retransmitir el stream
app.get('/stream', (req, res) => {
  const url = 'https://centova.hostingtico.com:7016/';

  // Realizar la solicitud al servidor de audio y transmitir la respuesta
  request({ 
    url, 
    rejectUnauthorized: false // Ignorar errores de certificado
  }).pipe(res).on('error', (err) => {
    console.error('Error al acceder al stream:', err);
    res.sendStatus(500);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
