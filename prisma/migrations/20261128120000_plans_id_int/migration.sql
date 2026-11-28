-- El id de plans pasa de texto ('familiar') a un número autoincremental, como
-- en las demás tablas. El texto que identifica al plan queda en name, que ya
-- era único ('Familiar', 'Individual').
-- Se escribió a mano para no perder datos: Prisma habría borrado la columna y
-- creado otra vacía, y eso falla si la tabla ya tiene planes. Acá se le da un
-- número a cada plan y se actualizan las tablas que lo usan (prices y
-- enrollments) antes de borrar la columna vieja.

-- 1. Se sacan las FK, la PK y el índice único que usan el id viejo.
ALTER TABLE "prices" DROP CONSTRAINT "prices_plan_id_fkey";
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_plan_id_fkey";
ALTER TABLE "prices" DROP CONSTRAINT "prices_pkey";
DROP INDEX "enrollments_person_id_plan_id_procedure_date_key";
ALTER TABLE "plans" DROP CONSTRAINT "plans_pkey";

-- 2. Cada plan recibe su número. Los del seed llevan el mismo que en
-- database/seed.sql, así una base migrada y una nueva coinciden; si hay otros
-- (creados desde la API), siguen desde el 6, en orden alfabético.
ALTER TABLE "plans" ADD COLUMN "new_id" INTEGER;
UPDATE "plans" SET "new_id" = CASE "id"
  WHEN 'individual' THEN 1
  WHEN 'familiar' THEN 2
  WHEN 'familia-numerosa' THEN 3
  WHEN 'jubilado' THEN 4
  WHEN 'infantil' THEN 5
END;
UPDATE "plans" SET "new_id" = "others"."n"
  FROM (
    SELECT "id", 5 + ROW_NUMBER() OVER (ORDER BY "name") AS "n"
    FROM "plans" WHERE "new_id" IS NULL
  ) AS "others"
  WHERE "plans"."id" = "others"."id";

-- 3. prices y enrollments pasan a guardar el número del plan.
ALTER TABLE "prices" ADD COLUMN "new_plan_id" INTEGER;
UPDATE "prices" SET "new_plan_id" = "plans"."new_id"
  FROM "plans" WHERE "plans"."id" = "prices"."plan_id";

ALTER TABLE "enrollments" ADD COLUMN "new_plan_id" INTEGER;
UPDATE "enrollments" SET "new_plan_id" = "plans"."new_id"
  FROM "plans" WHERE "plans"."id" = "enrollments"."plan_id";

-- 4. Se borran las columnas de texto y las nuevas toman su nombre.
ALTER TABLE "prices" DROP COLUMN "plan_id";
ALTER TABLE "prices" RENAME COLUMN "new_plan_id" TO "plan_id";
ALTER TABLE "prices" ALTER COLUMN "plan_id" SET NOT NULL;

ALTER TABLE "enrollments" DROP COLUMN "plan_id";
ALTER TABLE "enrollments" RENAME COLUMN "new_plan_id" TO "plan_id";
ALTER TABLE "enrollments" ALTER COLUMN "plan_id" SET NOT NULL;

ALTER TABLE "plans" DROP COLUMN "id";
ALTER TABLE "plans" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "plans" ALTER COLUMN "id" SET NOT NULL;

-- La secuencia es la que da el próximo número (autoincremental). Arranca
-- después del id más alto, así el próximo plan que se cree no choca.
CREATE SEQUENCE "plans_id_seq" OWNED BY "plans"."id";
ALTER TABLE "plans" ALTER COLUMN "id" SET DEFAULT nextval('plans_id_seq');
SELECT setval('plans_id_seq', COALESCE((SELECT MAX("id") FROM "plans"), 0) + 1, false);

-- 5. Se vuelven a crear la PK, el índice único y las FK, ahora con números.
ALTER TABLE "plans" ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");
ALTER TABLE "prices" ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("rate_table_id", "plan_id");
CREATE UNIQUE INDEX "enrollments_person_id_plan_id_procedure_date_key" ON "enrollments"("person_id", "plan_id", "procedure_date");
ALTER TABLE "prices" ADD CONSTRAINT "prices_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
