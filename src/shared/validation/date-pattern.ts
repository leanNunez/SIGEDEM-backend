// QUÉ ES: la regex que comparten los DTOs que reciben una fecha sin hora.
// NIVEL: constante compartida — solo describe un formato, no tiene lógica.
// DÓNDE SE USA: los DTOs de persons, enrollments, payments y bookings, junto
// con @IsDateString({ strict: true }).
// A FUTURO: si aparece otro campo de fecha, se valida igual que estos.

// @IsDateString solo no alcanza: acepta textos con hora y zona horaria
// ('2026-12-01T23:00:00-03:00'), que al guardarse en una columna DATE pueden
// cambiar de día. Esta regex exige el texto exacto AAAA-MM-DD:
//   ^ y $    → la regla se aplica al texto completo.
//   \d{4}    → 4 números para el año.
//   -\d{2}   → un guion y 2 números, para el mes y para el día.
// Ejemplos: '2026-11-05' pasa; '2026-11-05T10:00:00Z' y '5/11/2026' no.
// Que el día exista (que no sea '2026-02-30') lo revisa strict: true.
export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
