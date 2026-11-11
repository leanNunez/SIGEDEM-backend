-- SIGEDEM: estructura de la base de datos (PostgreSQL).
-- Sale del modelo de dominio de Metodología de Sistemas y de los formularios
-- del front. Los id de plans y courts son los mismos que usa el front.

DROP TABLE IF EXISTS bookings, renters, courts, consents, medical_certificates, carnets,
  membership_members, memberships, payments, enrollments, prices, rate_tables,
  seasons, plans, persons, family_groups, users, roles;

-- Roles: los actores primarios del diagrama de casos de uso (versión 2).
CREATE TABLE roles (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(30) NOT NULL UNIQUE,
  description VARCHAR(150) NOT NULL
);

-- Cuentas de quienes usan el sistema.
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  role_id       INTEGER NOT NULL REFERENCES roles (id),
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grupo familiar: cada persona integra como mucho uno.
CREATE TABLE family_groups (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(60) NOT NULL,
  max_members SMALLINT NOT NULL CHECK (max_members > 0)
);

-- Padrón único de vecinos: cada DNI aparece una sola vez.
CREATE TABLE persons (
  id              SERIAL PRIMARY KEY,
  family_group_id INTEGER REFERENCES family_groups (id),
  dni             VARCHAR(8) NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$'),
  first_name      VARCHAR(60) NOT NULL,
  last_name       VARCHAR(60) NOT NULL,
  birth_date      DATE NOT NULL,
  email           VARCHAR(120),
  phone           VARCHAR(30)
);

-- Planes del abono. Los campos son los que muestra el front en /planes; el
-- precio mensual no va acá porque cambia con cada cuadro tarifario.
CREATE TABLE plans (
  id            VARCHAR(30) PRIMARY KEY,
  name          VARCHAR(60) NOT NULL UNIQUE,
  type          VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'familiar')),
  people        VARCHAR(40) NOT NULL,
  description   VARCHAR(200) NOT NULL,
  discount_note VARCHAR(200),
  badge         VARCHAR(40)
);

-- Temporada del abono.
CREATE TABLE seasons (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(40) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date   DATE NOT NULL,
  CHECK (end_date > start_date)
);

-- Cuadro tarifario: los precios que rigen en una temporada, según la
-- resolución municipal.
CREATE TABLE rate_tables (
  id         SERIAL PRIMARY KEY,
  season_id  INTEGER NOT NULL REFERENCES seasons (id),
  resolution VARCHAR(40) NOT NULL UNIQUE
);

-- Precio de cada plan dentro de un cuadro tarifario.
CREATE TABLE prices (
  rate_table_id INTEGER NOT NULL REFERENCES rate_tables (id) ON DELETE CASCADE,
  plan_id       VARCHAR(30) NOT NULL REFERENCES plans (id),
  amount        NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  PRIMARY KEY (rate_table_id, plan_id)
);

-- Solicitud de inscripción: existe desde que el vecino se anota, aunque
-- todavía no haya pagado. procedure_date es la fecha real del trámite y
-- loaded_at cuándo se cargó (difieren si se tomó en papel).
CREATE TABLE enrollments (
  id             SERIAL PRIMARY KEY,
  person_id      INTEGER NOT NULL REFERENCES persons (id),
  plan_id        VARCHAR(30) NOT NULL REFERENCES plans (id),
  created_by     INTEGER NOT NULL REFERENCES users (id),
  status         VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                 CHECK (status IN ('pendiente', 'acreditada', 'anulada')),
  procedure_date DATE NOT NULL,
  loaded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Evita cargar dos veces el mismo formulario de papel.
  UNIQUE (person_id, plan_id, procedure_date)
);

-- Pago informado: el dinero no pasa por el complejo, se registra la
-- transferencia. El número de operación único detecta comprobantes repetidos.
CREATE TABLE payments (
  id               SERIAL PRIMARY KEY,
  enrollment_id    INTEGER NOT NULL REFERENCES enrollments (id),
  method           VARCHAR(20) NOT NULL DEFAULT 'transferencia',
  amount           NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  paid_on          DATE NOT NULL,
  operation_number VARCHAR(30) NOT NULL UNIQUE,
  status           VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                   CHECK (status IN ('pendiente', 'acreditado', 'rechazado')),
  verified_by      INTEGER REFERENCES users (id)
);

-- Abono: recién existe cuando el pago está acreditado. Una inscripción
-- origina como mucho un abono, con su constancia numerada.
CREATE TABLE memberships (
  id                 SERIAL PRIMARY KEY,
  enrollment_id      INTEGER NOT NULL UNIQUE REFERENCES enrollments (id),
  certificate_number VARCHAR(20) NOT NULL UNIQUE,
  status             VARCHAR(20) NOT NULL DEFAULT 'activo'
                     CHECK (status IN ('activo', 'vencido', 'anulado')),
  valid_from         DATE NOT NULL,
  valid_to           DATE NOT NULL,
  CHECK (valid_to > valid_from)
);

-- Un abono cubre a una o más personas (plan familiar) y una persona puede
-- tener varios abonos en el tiempo: relación muchos a muchos.
CREATE TABLE membership_members (
  membership_id INTEGER NOT NULL REFERENCES memberships (id) ON DELETE CASCADE,
  person_id     INTEGER NOT NULL REFERENCES persons (id),
  PRIMARY KEY (membership_id, person_id)
);

-- Carnet de cada persona cubierta por un abono.
CREATE TABLE carnets (
  id            SERIAL PRIMARY KEY,
  membership_id INTEGER NOT NULL,
  person_id     INTEGER NOT NULL,
  number        VARCHAR(20) NOT NULL UNIQUE,
  status        VARCHAR(20) NOT NULL DEFAULT 'vigente'
                CHECK (status IN ('vigente', 'vencido', 'anulado')),
  -- Compuesta: el carnet solo puede ser de alguien cubierto por ese abono.
  FOREIGN KEY (membership_id, person_id)
    REFERENCES membership_members (membership_id, person_id),
  UNIQUE (membership_id, person_id)
);

-- Aptos médicos: se guarda el historial, por eso una persona puede tener varios.
CREATE TABLE medical_certificates (
  id          SERIAL PRIMARY KEY,
  person_id   INTEGER NOT NULL REFERENCES persons (id),
  recorded_by INTEGER NOT NULL REFERENCES users (id),
  issued_on   DATE NOT NULL,
  valid_until DATE NOT NULL,
  CHECK (valid_until > issued_on)
);

-- Consentimiento para tratar datos de salud, otorgado por el vecino o su tutor.
CREATE TABLE consents (
  id        SERIAL PRIMARY KEY,
  person_id INTEGER NOT NULL REFERENCES persons (id),
  given_on  DATE NOT NULL,
  scope     VARCHAR(120) NOT NULL
);

-- Canchas en alquiler. units es cuántas canchas iguales hay de cada tipo.
CREATE TABLE courts (
  id           VARCHAR(30) PRIMARY KEY,
  activity     VARCHAR(20) NOT NULL CHECK (activity IN ('futbol', 'voley')),
  name         VARCHAR(60) NOT NULL UNIQUE,
  detail       VARCHAR(120) NOT NULL,
  units        SMALLINT NOT NULL CHECK (units > 0),
  member_price NUMERIC(10, 2) NOT NULL CHECK (member_price >= 0),
  public_price NUMERIC(10, 2) NOT NULL CHECK (public_price >= member_price)
);

-- Quien alquila una cancha. No va a persons porque el alquiler también está
-- abierto a quien no es socio. Sus datos se guardan una sola vez por DNI: si
-- estuvieran en bookings, el nombre y el teléfono dependerían del DNI y no de
-- la reserva (dependencia transitiva), y se repetirían en cada reserva (3FN).
CREATE TABLE renters (
  id        SERIAL PRIMARY KEY,
  -- Un DNI aparece una sola vez: la misma persona reusa su fila en cada reserva.
  dni       VARCHAR(8) NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$'),
  full_name VARCHAR(120) NOT NULL,
  phone     VARCHAR(30) NOT NULL
);

-- Reserva de un turno de una hora.
CREATE TABLE bookings (
  id           SERIAL PRIMARY KEY,
  court_id     VARCHAR(30) NOT NULL REFERENCES courts (id),
  court_number SMALLINT NOT NULL DEFAULT 1 CHECK (court_number > 0),
  date         DATE NOT NULL,
  hour         SMALLINT NOT NULL CHECK (hour BETWEEN 0 AND 23),
  renter_id    INTEGER NOT NULL REFERENCES renters (id),
  -- is_member y price son una foto del momento de la reserva: si después el
  -- que alquila deja de ser socio o cambia el precio de la cancha, la reserva
  -- conserva lo que se cobró. Dependen de la reserva, no del DNI ni de la cancha.
  is_member    BOOLEAN NOT NULL DEFAULT FALSE,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  -- Una misma cancha no se puede reservar dos veces en el mismo turno.
  UNIQUE (court_id, court_number, date, hour)
);
