import { Router } from 'express';
import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

dotenv.config(); // carga las variables de entorno desde el archivo .env

const router = Router();

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY, // aca toma la clave de la credencial de la API de Google Maps
});

router.post('/', async (req, res) => {
  const { latitude, longitude } = req.body; 
// se asegura que el cuerpo de la solicitud contenga las coordenadas
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Faltan coordenadas' });
  }

  try {
    const [ubicacion] = await geocoder.reverse({ lat: latitude, lon: longitude }); // se usa el método reverse para obtener la ubicación a partir de las coordenadas

    const ciudad = ubicacion.city || 'Ciudad desconocida';
    const pais = ubicacion.country || 'País desconocido';

    res.json({ ciudad, pais }); // se envía la ciudad y el país como respuesta
  } catch (error) {
    console.error('Error en geocoder:', error.message);
    res.status(500).json({ error: 'Error al obtener ubicación' });
  }
});

export default class RouterUbicacion {
  start() {
    return router;
  }
}
