-- SIGEDEM: datos de ejemplo, como mínimo 5 registros por tabla (TP 9).
-- Las personas son ficticias. Se carga con npx prisma db seed, después de
-- crear las tablas con la migración (npx prisma migrate dev).

INSERT INTO roles (name, description) VALUES
  ('operador', 'Mesa de entrada: registra inscripciones y pagos informados'),
  ('coordinador', 'Coordinación de sede: verifica acreditaciones y anula'),
  ('medico', 'Personal médico: registra los aptos médicos'),
  ('direccion', 'Dirección de Deportes: administra planes y ve reportes'),
  ('vecino', 'Vecino o tutor: otorga el consentimiento de datos de salud');

-- password_hash es un marcador: se reemplaza cuando esté el login.
INSERT INTO users (role_id, full_name, email, password_hash) VALUES
  (1, 'Marta Quiroga', 'operador@example.com', 'sin-hash'),
  (2, 'Julio Medina', 'coordinador@example.com', 'sin-hash'),
  (3, 'Elena Paz', 'medico@example.com', 'sin-hash'),
  (4, 'Raúl Ibáñez', 'direccion@example.com', 'sin-hash'),
  (5, 'Ana Gómez', 'vecino@example.com', 'sin-hash');

INSERT INTO family_groups (name, max_members) VALUES
  ('Familia Díaz', 4),
  ('Familia Ruiz', 4),
  ('Familia Sosa', 4),
  ('Familia Gómez', 4),
  ('Familia Vega', 6);

INSERT INTO persons (family_group_id, dni, first_name, last_name, birth_date, email, phone) VALUES
  (4, '30111222', 'Ana', 'Gómez', '1983-05-12', 'ana.gomez@example.com', '381 555-0101'),
  (1, '31222333', 'Bruno', 'Díaz', '1985-09-30', 'bruno.diaz@example.com', '381 555-0102'),
  (1, '45333444', 'Carla', 'Díaz', '2004-03-15', 'carla.diaz@example.com', '381 555-0103'),
  (NULL, '12444555', 'Héctor', 'Luna', '1952-11-02', NULL, '381 555-0104'),
  (2, '33555666', 'Laura', 'Ruiz', '1988-01-20', 'laura.ruiz@example.com', '381 555-0105'),
  (3, '34666777', 'Martín', 'Sosa', '1990-07-08', 'martin.sosa@example.com', '381 555-0106'),
  (5, '38777888', 'Paula', 'Vega', '1995-12-24', 'paula.vega@example.com', '381 555-0107'),
  (NULL, '40888999', 'Tomás', 'Herrera', '1998-02-14', NULL, '381 555-0108'),
  (2, '50999000', 'Lucía', 'Ruiz', '2012-06-03', NULL, '381 555-0105'),
  (3, '51000111', 'Diego', 'Sosa', '2013-08-19', NULL, '381 555-0106');

-- Los tres primeros son los del front; jubilado e infantil son de ejemplo.
INSERT INTO plans (id, name, type, people, description, discount_note, badge) VALUES
  ('individual', 'Individual', 'individual', '1 persona', 'Acceso completo al complejo para una persona.', 'Jubilados y pensionados: 50 % de descuento presentando el carnet.', NULL),
  ('familiar', 'Familiar', 'familiar', 'Hasta 4 personas', 'Para el grupo familiar que vive en la misma casa.', NULL, 'Más elegido'),
  ('familia-numerosa', 'Familia numerosa', 'familiar', '5 personas o más', 'Sin costo extra desde el quinto integrante.', 'Se acredita con la libreta o las partidas de nacimiento.', NULL),
  ('jubilado', 'Jubilado', 'individual', '1 persona', 'Plan de ejemplo con el 50 % de descuento ya aplicado.', 'Presentando el carnet de jubilado o pensionado.', NULL),
  ('infantil', 'Infantil', 'individual', '1 persona', 'Plan de ejemplo para menores de 12 años.', NULL, NULL);

INSERT INTO seasons (name, start_date, end_date) VALUES
  ('Temporada 2022-2023', '2022-09-01', '2023-04-30'),
  ('Temporada 2023-2024', '2023-09-01', '2024-04-30'),
  ('Temporada 2024-2025', '2024-09-01', '2025-04-30'),
  ('Temporada 2025-2026', '2025-09-01', '2026-04-30'),
  ('Temporada 2026-2027', '2026-09-01', '2027-04-30');

INSERT INTO rate_tables (season_id, resolution) VALUES
  (1, 'Resolución 101/2022'),
  (2, 'Resolución 102/2023'),
  (3, 'Resolución 103/2024'),
  (4, 'Resolución 104/2025'),
  (5, 'Resolución 105/2026');

-- El cuadro 5 tiene los precios actuales del front; los anteriores son de ejemplo.
INSERT INTO prices (rate_table_id, plan_id, amount) VALUES
  (1, 'individual', 10800), (1, 'familiar', 25200), (1, 'familia-numerosa', 30000), (1, 'jubilado', 5400), (1, 'infantil', 7200),
  (2, 'individual', 12600), (2, 'familiar', 29400), (2, 'familia-numerosa', 35000), (2, 'jubilado', 6300), (2, 'infantil', 8400),
  (3, 'individual', 14400), (3, 'familiar', 33600), (3, 'familia-numerosa', 40000), (3, 'jubilado', 7200), (3, 'infantil', 9600),
  (4, 'individual', 16200), (4, 'familiar', 37800), (4, 'familia-numerosa', 45000), (4, 'jubilado', 8100), (4, 'infantil', 10800),
  (5, 'individual', 18000), (5, 'familiar', 42000), (5, 'familia-numerosa', 50000), (5, 'jubilado', 9000), (5, 'infantil', 12000);

INSERT INTO enrollments (person_id, plan_id, created_by, status, procedure_date, loaded_at) VALUES
  (1, 'individual', 1, 'acreditada', '2026-10-01', '2026-10-01 09:30-03'),
  (2, 'familiar', 1, 'acreditada', '2026-10-02', '2026-10-02 10:15-03'),
  (4, 'jubilado', 1, 'acreditada', '2026-10-05', '2026-10-08 11:00-03'), -- tomada en papel
  (5, 'individual', 1, 'acreditada', '2026-10-06', '2026-10-06 16:40-03'),
  (6, 'individual', 1, 'acreditada', '2026-10-07', '2026-10-07 17:05-03'),
  (7, 'individual', 1, 'pendiente', '2026-10-28', '2026-10-28 09:10-03'),
  (8, 'individual', 1, 'anulada', '2026-10-20', '2026-10-20 12:20-03');

INSERT INTO payments (enrollment_id, amount, paid_on, operation_number, status, verified_by) VALUES
  (1, 18000, '2026-10-01', 'OP-100001', 'acreditado', 2),
  (2, 42000, '2026-10-02', 'OP-100002', 'acreditado', 2),
  (3, 9000, '2026-10-05', 'OP-100003', 'acreditado', 2),
  (4, 18000, '2026-10-06', 'OP-100004', 'acreditado', 2),
  (5, 18000, '2026-10-07', 'OP-100005', 'acreditado', 2),
  (6, 18000, '2026-10-29', 'OP-100006', 'pendiente', NULL),
  (7, 18000, '2026-10-20', 'OP-100007', 'rechazado', 2);

-- Solo las inscripciones con pago acreditado tienen abono.
INSERT INTO memberships (enrollment_id, certificate_number, valid_from, valid_to) VALUES
  (1, 'C-2026-0001', '2026-10-01', '2026-11-30'),
  (2, 'C-2026-0002', '2026-10-02', '2026-12-01'),
  (3, 'C-2026-0003', '2026-10-08', '2026-12-07'),
  (4, 'C-2026-0004', '2026-10-06', '2026-12-05'),
  (5, 'C-2026-0005', '2026-10-07', '2026-12-06');

-- El abono 2 es familiar: cubre a Bruno y a Carla.
INSERT INTO membership_members (membership_id, person_id) VALUES
  (1, 1), (2, 2), (2, 3), (3, 4), (4, 5), (5, 6);

INSERT INTO carnets (membership_id, person_id, number) VALUES
  (1, 1, 'S-000001'),
  (2, 2, 'S-000002'),
  (2, 3, 'S-000003'),
  (3, 4, 'S-000004'),
  (4, 5, 'S-000005'),
  (5, 6, 'S-000006');

INSERT INTO medical_certificates (person_id, recorded_by, issued_on, valid_until) VALUES
  (1, 3, '2026-09-20', '2027-09-20'),
  (2, 3, '2026-09-22', '2027-09-22'),
  (3, 3, '2026-09-22', '2027-09-22'),
  (4, 3, '2026-10-03', '2027-10-03'),
  (5, 3, '2026-10-04', '2027-10-04'),
  (6, 3, '2026-10-05', '2027-10-05');

INSERT INTO consents (person_id, given_on, scope) VALUES
  (1, '2026-09-20', 'Datos del apto médico'),
  (2, '2026-09-22', 'Datos del apto médico'),
  (3, '2026-09-22', 'Datos del apto médico'),
  (4, '2026-10-03', 'Datos del apto médico'),
  (5, '2026-10-04', 'Datos del apto médico'),
  (6, '2026-10-05', 'Datos del apto médico');

-- Las cuatro primeras son las del front; fútbol 7 es de ejemplo.
INSERT INTO courts (id, activity, name, detail, units, member_price, public_price) VALUES
  ('futbol-5', 'futbol', 'Fútbol 5', 'Cuatro canchas con iluminación LED', 4, 15000, 22000),
  ('futbol-11', 'futbol', 'Fútbol 11', 'Dos canchas reglamentarias', 2, 35000, 50000),
  ('voley-cubierta', 'voley', 'Vóley cubierta', 'Dos canchas con piso flotante', 2, 10000, 15000),
  ('voley-playa', 'voley', 'Vóley playa', 'Tres canchas de arena', 3, 8000, 12000),
  ('futbol-7', 'futbol', 'Fútbol 7', 'Cancha de ejemplo', 1, 25000, 36000);

-- Quienes alquilaron canchas. Algunos son socios (están en persons) y otros no.
INSERT INTO renters (dni, full_name, phone) VALUES
  ('30111222', 'Ana Gómez', '381 555-0101'),
  ('29123456', 'Pedro Ledesma', '381 555-0201'),
  ('31222333', 'Bruno Díaz', '381 555-0102'),
  ('41234567', 'Sofía Paz', '381 555-0202'),
  ('33555666', 'Laura Ruiz', '381 555-0105');

-- Ana (renter 1) reservó dos veces: sus datos están una sola vez en renters.
INSERT INTO bookings (court_id, court_number, date, hour, renter_id, is_member, price) VALUES
  ('futbol-5', 1, '2026-11-05', 20, 1, TRUE, 15000),
  ('futbol-5', 2, '2026-11-05', 20, 2, FALSE, 22000),
  ('futbol-11', 1, '2026-11-06', 21, 3, TRUE, 35000),
  ('voley-cubierta', 1, '2026-11-07', 18, 4, FALSE, 15000),
  ('voley-playa', 3, '2026-11-08', 17, 5, TRUE, 8000),
  ('futbol-5', 1, '2026-11-12', 20, 1, TRUE, 15000);
