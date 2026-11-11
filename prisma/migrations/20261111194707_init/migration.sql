-- Migración inicial de SIGEDEM: crea todas las tablas.
-- La generó npx prisma migrate dev --name init --create-only a partir de
-- prisma/schema.prisma; al final se agregaron a mano los CHECK, que Prisma no
-- genera. Ya está aplicada: no se edita más. Los cambios nuevos van en otra
-- migración.

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(150) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "max_members" SMALLINT NOT NULL,

    CONSTRAINT "family_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "family_group_id" INTEGER,
    "dni" VARCHAR(8) NOT NULL,
    "first_name" VARCHAR(60) NOT NULL,
    "last_name" VARCHAR(60) NOT NULL,
    "birth_date" DATE NOT NULL,
    "email" VARCHAR(120),
    "phone" VARCHAR(30),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "people" VARCHAR(40) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "discount_note" VARCHAR(200),
    "badge" VARCHAR(40),

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_tables" (
    "id" SERIAL NOT NULL,
    "season_id" INTEGER NOT NULL,
    "resolution" VARCHAR(40) NOT NULL,

    CONSTRAINT "rate_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "rate_table_id" INTEGER NOT NULL,
    "plan_id" VARCHAR(30) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("rate_table_id","plan_id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "plan_id" VARCHAR(30) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "procedure_date" DATE NOT NULL,
    "loaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "method" VARCHAR(20) NOT NULL DEFAULT 'transferencia',
    "amount" DECIMAL(10,2) NOT NULL,
    "paid_on" DATE NOT NULL,
    "operation_number" VARCHAR(30) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "verified_by" INTEGER,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" SERIAL NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "certificate_number" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "valid_from" DATE NOT NULL,
    "valid_to" DATE NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_members" (
    "membership_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "membership_members_pkey" PRIMARY KEY ("membership_id","person_id")
);

-- CreateTable
CREATE TABLE "carnets" (
    "id" SERIAL NOT NULL,
    "membership_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'vigente',

    CONSTRAINT "carnets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_certificates" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "recorded_by" INTEGER NOT NULL,
    "issued_on" DATE NOT NULL,
    "valid_until" DATE NOT NULL,

    CONSTRAINT "medical_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "given_on" DATE NOT NULL,
    "scope" VARCHAR(120) NOT NULL,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" VARCHAR(30) NOT NULL,
    "activity" VARCHAR(20) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "detail" VARCHAR(120) NOT NULL,
    "units" SMALLINT NOT NULL,
    "member_price" DECIMAL(10,2) NOT NULL,
    "public_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renters" (
    "id" SERIAL NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,

    CONSTRAINT "renters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "court_id" VARCHAR(30) NOT NULL,
    "court_number" SMALLINT NOT NULL DEFAULT 1,
    "date" DATE NOT NULL,
    "hour" SMALLINT NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "is_member" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "persons_dni_key" ON "persons"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_name_key" ON "seasons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rate_tables_resolution_key" ON "rate_tables"("resolution");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_person_id_plan_id_procedure_date_key" ON "enrollments"("person_id", "plan_id", "procedure_date");

-- CreateIndex
CREATE UNIQUE INDEX "payments_operation_number_key" ON "payments"("operation_number");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_enrollment_id_key" ON "memberships"("enrollment_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_certificate_number_key" ON "memberships"("certificate_number");

-- CreateIndex
CREATE UNIQUE INDEX "carnets_number_key" ON "carnets"("number");

-- CreateIndex
CREATE UNIQUE INDEX "carnets_membership_id_person_id_key" ON "carnets"("membership_id", "person_id");

-- CreateIndex
CREATE UNIQUE INDEX "courts_name_key" ON "courts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "renters_dni_key" ON "renters"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_court_id_court_number_date_hour_key" ON "bookings"("court_id", "court_number", "date", "hour");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_family_group_id_fkey" FOREIGN KEY ("family_group_id") REFERENCES "family_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rate_tables" ADD CONSTRAINT "rate_tables_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_rate_table_id_fkey" FOREIGN KEY ("rate_table_id") REFERENCES "rate_tables"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "membership_members" ADD CONSTRAINT "membership_members_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "membership_members" ADD CONSTRAINT "membership_members_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carnets" ADD CONSTRAINT "carnets_membership_id_person_id_fkey" FOREIGN KEY ("membership_id", "person_id") REFERENCES "membership_members"("membership_id", "person_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medical_certificates" ADD CONSTRAINT "medical_certificates_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medical_certificates" ADD CONSTRAINT "medical_certificates_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "renters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Restricciones CHECK. Prisma no las puede escribir en schema.prisma, así que
-- no las genera: se agregaron a mano en esta migración (son las mismas que
-- tenía database/schema.sql). Los DTOs de la API repiten estas reglas para
-- responder 400 con un mensaje claro antes de llegar a la base.

-- Un grupo familiar tiene al menos un integrante.
ALTER TABLE "family_groups" ADD CONSTRAINT "family_groups_max_members_check" CHECK ("max_members" > 0);

-- El DNI son 7 u 8 números, sin puntos.
ALTER TABLE "persons" ADD CONSTRAINT "persons_dni_check" CHECK ("dni" ~ '^[0-9]{7,8}$');

ALTER TABLE "plans" ADD CONSTRAINT "plans_type_check" CHECK ("type" IN ('individual', 'familiar'));

-- La temporada termina después de empezar.
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_check" CHECK ("end_date" > "start_date");

ALTER TABLE "prices" ADD CONSTRAINT "prices_amount_check" CHECK ("amount" >= 0);

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_status_check" CHECK ("status" IN ('pendiente', 'acreditada', 'anulada'));

-- Un pago informado siempre es por un monto mayor que 0.
ALTER TABLE "payments" ADD CONSTRAINT "payments_amount_check" CHECK ("amount" > 0);
ALTER TABLE "payments" ADD CONSTRAINT "payments_status_check" CHECK ("status" IN ('pendiente', 'acreditado', 'rechazado'));

ALTER TABLE "memberships" ADD CONSTRAINT "memberships_status_check" CHECK ("status" IN ('activo', 'vencido', 'anulado'));
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_check" CHECK ("valid_to" > "valid_from");

ALTER TABLE "carnets" ADD CONSTRAINT "carnets_status_check" CHECK ("status" IN ('vigente', 'vencido', 'anulado'));

ALTER TABLE "medical_certificates" ADD CONSTRAINT "medical_certificates_check" CHECK ("valid_until" > "issued_on");

ALTER TABLE "courts" ADD CONSTRAINT "courts_activity_check" CHECK ("activity" IN ('futbol', 'voley'));
ALTER TABLE "courts" ADD CONSTRAINT "courts_units_check" CHECK ("units" > 0);
ALTER TABLE "courts" ADD CONSTRAINT "courts_member_price_check" CHECK ("member_price" >= 0);
-- El precio para el público nunca es menor que el de socios.
ALTER TABLE "courts" ADD CONSTRAINT "courts_public_price_check" CHECK ("public_price" >= "member_price");

ALTER TABLE "renters" ADD CONSTRAINT "renters_dni_check" CHECK ("dni" ~ '^[0-9]{7,8}$');

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_court_number_check" CHECK ("court_number" > 0);
-- Los turnos son de una hora, de 0 a 23.
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hour_check" CHECK ("hour" BETWEEN 0 AND 23);
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_price_check" CHECK ("price" >= 0);
