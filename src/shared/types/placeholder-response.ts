// QUÉ ES: la forma de la respuesta provisoria de los services del TP 10.
// NIVEL: tipo compartido — solo describe datos, no tiene lógica.
// DÓNDE SE USA: los services de plans, persons, enrollments, payments, courts
// y bookings, mientras la API todavía no está conectada a la base.
// A FUTURO: en el TP 11 los services devuelven los datos de la base y este
// tipo se borra.

// <T> es el tipo del body que se devuelve en data (por ejemplo, CreatePlanDto).
export interface PlaceholderResponse<T = never> {
  // Explica en español qué hizo la API con el pedido.
  message: string;
  // El id que vino en la URL, si la ruta tiene uno.
  id?: number | string;
  // El body que llegó, ya validado por ValidationPipe.
  data?: T;
}
