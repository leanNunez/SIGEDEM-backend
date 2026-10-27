// Variables de entorno leídas en un solo lugar. Si falta el .env, se usan
// estos valores por defecto para desarrollo local.
export const env = {
  port: Number(process.env.PORT ?? 3000),
  // Origen del front que puede llamar a la API (CORS).
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};
