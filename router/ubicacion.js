import { Router } from 'express';
import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY,
});

router.post('/', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Faltan coordenadas' });
  }

  try {
    const [ubicacion] = await geocoder.reverse({ lat: latitude, lon: longitude });

    const ciudad = ubicacion.city || 'Ciudad desconocida';
    const pais = ubicacion.country || 'País desconocido';

    res.json({ ciudad, pais });
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
