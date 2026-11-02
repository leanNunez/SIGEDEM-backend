# Cómo escribimos el código en SIGEDEM-backend

Esta guía es el acuerdo del equipo para que todo el código se lea igual, lo escriba una persona o Claude. La idea es que **cualquiera del equipo pueda abrir un archivo y explicarlo en la defensa**. Si algo no está acá, se copia el estilo del módulo más parecido que ya exista.

## Las reglas en una tabla

| #   | Regla                                           | En la práctica                                                                                               |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Código fácil de leer                            | Nombres claros, funciones cortas, sin trucos. Si hay que pensar mucho para entender una línea, se reescribe. |
| 2   | Una función hace una sola cosa                  | Si el nombre necesita un "y" (`validarYGuardar`), son dos funciones.                                         |
| 3   | Cada archivo tiene cabecera                     | `QUÉ ES / NIVEL / DÓNDE SE USA / A FUTURO`, igual que en el front.                                           |
| 4   | Cada función tiene JSDoc                        | Qué hace, qué recibe, qué devuelve y qué error puede tirar.                                                  |
| 5   | Comentarios de línea solo en lo que no es obvio | Se explica el **por qué**, no se repite el código.                                                           |
| 6   | Cada capa tiene su trabajo                      | El controller recibe y responde; el service tiene la lógica.                                                 |

## Idioma

| Qué                                                           | Idioma                    | Ejemplo                                    |
| ------------------------------------------------------------- | ------------------------- | ------------------------------------------ |
| Nombres en el código (clases, funciones, variables, columnas) | Inglés                    | `PlansService`, `findOne`, `monthly_price` |
| Comentarios y JSDoc                                           | Español                   | `// Busca el plan por su id.`              |
| Mensajes de error para el usuario                             | Español                   | `'No existe un plan con ese id'`           |
| Valores del dominio (estados, roles, slugs)                   | Español, como en el front | `'pendiente'`, `'futbol'`, `'familiar'`    |
| Commits y PRs                                                 | Español                   | `feat(plans): agrega GET /api/plans/:id`   |

## Estructura de un módulo

Cada módulo sale de `npx nest g resource modules/<nombre>` (opciones: REST API y CRUD) y queda así:

```
src/modules/plans/
├── dto/
│   ├── create-plan.dto.ts   Lo que llega en el body al crear
│   └── update-plan.dto.ts   Lo mismo, pero con todos los campos opcionales
├── entities/
│   └── plan.entity.ts       Cómo es un plan (los mismos campos que la tabla)
├── plans.controller.ts      Rutas: recibe el pedido HTTP y devuelve la respuesta
├── plans.module.ts          Junta el controller y el service
└── plans.service.ts         La lógica: buscar, crear, validar reglas
```

| Capa         | Qué hace                                              | Qué NO hace                         |
| ------------ | ----------------------------------------------------- | ----------------------------------- |
| `controller` | Define la ruta, lee los parámetros y llama al service | No tiene lógica ni `if` de negocio  |
| `service`    | Tiene la lógica y las reglas, y tira los errores      | No sabe nada de HTTP (`req`, `res`) |
| `dto`        | Describe lo que **entra** a la API                    | No tiene funciones                  |
| `entity`     | Describe lo que **se guarda** (refleja la tabla)      | No tiene funciones                  |

Lo que comparten varios módulos va en `src/shared/` (configuración, base de datos).

## Comentarios

### 1. Cabecera de cada archivo

Va arriba de todo, después de los imports. Es el mismo formato que usa el front:

```ts
// QUÉ ES: el servicio de planes: buscar, crear, editar y borrar planes.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PlansController lo recibe por inyección de dependencias.
// A FUTURO: cuando conectemos la base, los datos salen de la tabla plans.
```

`A FUTURO` es opcional: se pone solo si hay algo pendiente.

### 2. JSDoc en cada función

Se escribe con `/** */` justo arriba de la función. Sirve porque **el editor lo muestra al pasar el mouse** por encima del nombre, en cualquier archivo donde se use.

```ts
/**
 * Busca un plan por su id.
 * @param id - El id del plan, por ejemplo 'familiar' (viene de la URL).
 * @returns El plan encontrado.
 * @throws NotFoundException si no existe un plan con ese id.
 */
findOne(id: string): Plan {
```

| Etiqueta      | Cuándo va                                    |
| ------------- | -------------------------------------------- |
| Primera línea | Siempre: qué hace la función, en una oración |
| `@param`      | Una por cada parámetro                       |
| `@returns`    | Si devuelve algo                             |
| `@throws`     | Si puede tirar un error                      |

### 3. Comentarios de línea: solo lo que no es obvio

| ❌ No (repite el código) | ✅ Sí (explica algo que no se ve)                                           |
| ------------------------ | --------------------------------------------------------------------------- |
| `// devuelve el plan`    | `// find devuelve undefined si no lo encuentra; por eso se controla abajo.` |
| `// suma uno`            | `// ParseIntPipe convierte "3" en 3 y responde 400 si no es un número.`     |
| `// constructor`         | `// Nest crea el service y lo pasa acá solo (inyección de dependencias).`   |

Siempre conviene comentar: decoradores de Nest (`@Get(':id')`, `@Body()`), pipes, inyección de dependencias, expresiones regulares y restricciones SQL.

## Funciones simples

- **Nombre con verbo** que diga qué hace: `findOne`, `calculatePrice`, `isCourtAvailable`.
- **Cortas:** si pasa de unas 20 líneas, probablemente se puede dividir.
- **Retorno temprano** en vez de `if` anidados:

  ```ts
  // ❌ Anidado: hay que leer todo para saber qué pasa.
  if (plan) {
    if (plan.type === 'familiar') {
      return 4;
    }
  }

  // ✅ Retorno temprano: cada caso se resuelve y sale.
  if (!plan) throw new NotFoundException('No existe un plan con ese id');
  if (plan.type !== 'familiar') return 1;
  return 4;
  ```

- **Sin números ni textos sueltos:** se ponen en una constante con nombre (`const BOOKING_DAYS_AHEAD = 14;`).
- **Tipos explícitos** en lo que recibe y devuelve cada función (`findOne(id: string): Plan`).

## Nombres

| Qué                   | Formato                          | Ejemplo                                  |
| --------------------- | -------------------------------- | ---------------------------------------- |
| Clases                | PascalCase                       | `PlansService`, `CreatePlanDto`          |
| Funciones y variables | camelCase                        | `findOne`, `monthlyPrice`                |
| Constantes fijas      | MAYÚSCULAS_CON_GUION             | `BOOKING_DAYS_AHEAD`                     |
| Archivos              | kebab-case con la capa           | `create-plan.dto.ts`, `plans.service.ts` |
| Tablas y columnas SQL | snake_case; las tablas en plural | `plans`, `monthly_price`                 |
| Booleanos             | Empiezan con `is` / `has`        | `isMember`, `hasPaid`                    |

## Imports: siempre con `.js`

El proyecto usa módulos ES (`"type": "module"` en `package.json`), así que **los imports propios terminan en `.js`** aunque el archivo sea `.ts`:

```ts
import { PlansService } from './plans.service.js'; // ✅
import { PlansService } from './plans.service'; // ❌ falla al arrancar
```

## Plantilla: un módulo completo comentado

Para un módulo nuevo, se copia esta plantilla y se cambian los nombres.

### `entities/plan.entity.ts`

```ts
// QUÉ ES: cómo es un plan del abono.
// NIVEL: entity — refleja la tabla plans de database/schema.sql.
// DÓNDE SE USA: PlansService devuelve objetos con esta forma.

export class Plan {
  // Identificador fijo y legible ('individual', 'familiar'), el mismo del front.
  id: string;
  name: string;
  // Solo puede ser uno de estos dos valores (igual que el CHECK de la tabla).
  type: 'individual' | 'familiar';
  people: string;
  description: string;
  // "?" = opcional: no todos los planes lo tienen (en la tabla puede ser NULL).
  discountNote?: string;
  badge?: string;
}
```

### `dto/create-plan.dto.ts`

```ts
// QUÉ ES: los datos que hay que mandar en el body para crear un plan.
// NIVEL: dto — describe lo que entra a la API.
// DÓNDE SE USA: PlansController lo recibe en POST /api/plans.
// A FUTURO: con class-validator se agregan las validaciones de cada campo.

export class CreatePlanDto {
  id: string;
  name: string;
  type: 'individual' | 'familiar';
  people: string;
  description: string;
  discountNote?: string;
  badge?: string;
}
```

### `plans.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { Plan } from './entities/plan.entity.js';

// QUÉ ES: el servicio de planes: buscar y crear planes.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PlansController lo recibe por inyección de dependencias.
// A FUTURO: cuando conectemos la base, los datos salen de la tabla plans.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PlansService {
  // Lista en memoria mientras no hay base de datos.
  private readonly plans: Plan[] = [];

  /**
   * Devuelve todos los planes.
   * @returns La lista de planes (vacía si no hay ninguno).
   */
  findAll(): Plan[] {
    return this.plans;
  }

  /**
   * Busca un plan por su id.
   * @param id - El id del plan, por ejemplo 'familiar'.
   * @returns El plan encontrado.
   * @throws NotFoundException si no existe un plan con ese id.
   */
  findOne(id: string): Plan {
    const plan = this.plans.find((item) => item.id === id);
    // find devuelve undefined si no lo encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!plan) throw new NotFoundException('No existe un plan con ese id');
    return plan;
  }

  /**
   * Crea un plan nuevo.
   * @param createPlanDto - Los datos del plan que llegaron en el body.
   * @returns El plan creado.
   */
  create(createPlanDto: CreatePlanDto): Plan {
    // Se copia el DTO en un objeto nuevo para no guardar la referencia original.
    const plan: Plan = { ...createPlanDto };
    this.plans.push(plan);
    return plan;
  }
}
```

### `plans.controller.ts`

```ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { Plan } from './entities/plan.entity.js';
import { PlansService } from './plans.service.js';

// QUÉ ES: las rutas de planes (/api/plans).
// NIVEL: controller — recibe el pedido HTTP y le pasa el trabajo al service.
// DÓNDE SE USA: lo registra PlansModule.

// @Controller('plans') hace que todas estas rutas empiecen con /api/plans
// (el /api lo agrega setupApp para toda la app).
@Controller('plans')
export class PlansController {
  // Nest crea PlansService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly plansService: PlansService) {}

  /**
   * GET /api/plans — lista todos los planes.
   * @returns Los planes.
   */
  @Get()
  findAll(): Plan[] {
    return this.plansService.findAll();
  }

  /**
   * GET /api/plans/:id — devuelve un plan.
   * @param id - El id que viene en la URL (/api/plans/familiar → 'familiar').
   * @returns El plan encontrado.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Plan {
    return this.plansService.findOne(id);
  }

  /**
   * POST /api/plans — crea un plan.
   * @param createPlanDto - El body del pedido.
   * @returns El plan creado.
   */
  @Post()
  create(@Body() createPlanDto: CreatePlanDto): Plan {
    return this.plansService.create(createPlanDto);
  }
}
```

> **Ids numéricos:** si el id de la tabla es `SERIAL` (un número), se usa `@Param('id', ParseIntPipe) id: number`, no `+id`. `ParseIntPipe` convierte el texto en número y responde 400 si no lo es.

## Base de datos (SQL)

Los scripts están en `database/`: primero se corre `schema.sql` y después `seed.sql`.

- **Cada tabla tiene un comentario** arriba que dice qué guarda.
- **Cada restricción que no es obvia también** (`UNIQUE`, `CHECK`, FK compuestas): se explica qué evita.
- Tablas en plural y snake_case; la clave primaria se llama `id`.
- Si se agrega un estado nuevo (por ejemplo, en `status`), hay que actualizar el `CHECK` **y** el tipo de la entity.

```sql
-- Reserva de un turno de una hora.
CREATE TABLE bookings (
  ...
  -- Una misma cancha no se puede reservar dos veces en el mismo turno.
  UNIQUE (court_id, court_number, date, hour)
);
```

## Git

| Rama                | Para qué                                   | Sale de / vuelve a                |
| ------------------- | ------------------------------------------ | --------------------------------- |
| `main`              | Versión estable (la entrega)               | Recibe PRs solo desde `dev`       |
| `dev`               | Integración del equipo                     | Recibe los PRs de las otras ramas |
| `feature/<nombre>`  | Funcionalidad nueva                        | `dev`                             |
| `fix/<nombre>`      | Corrección                                 | `dev`                             |
| `refactor/<nombre>` | Reorganizar código sin cambiar lo que hace | `dev`                             |
| `docs/<nombre>`     | Documentación                              | `dev`                             |

**Commits** con Conventional Commits, en español y en primera persona: `tipo(módulo): qué cambia`.

```
feat(plans): agrego GET /api/plans/:id
fix(booking): rechazo reservas en horarios que ya pasaron
docs(readme): explico cómo crear la base
```

**Cada PR** tiene estas secciones: _Qué cambia_, _Cómo probarlo_, _Pruebas realizadas_ (como checklist) y _A tener en cuenta_.

## Cómo pedirle código a Claude

Claude lee solo el archivo `CLAUDE.md` de la raíz, que lo manda a esta guía. Aun así, conviene ser concreto en el pedido:

```
Creá el módulo courts siguiendo docs/CONVENCIONES.md: entity y DTOs con los
campos de la tabla courts de database/schema.sql, y GET /api/courts y
GET /api/courts/:id.
```

```
Explicame plans.service.ts línea por línea, como para alguien que recién
empieza con Nest.
```

```
Revisá que bookings.service.ts cumpla docs/CONVENCIONES.md y decime qué falta.
```

Siempre hay que **leer y entender lo que generó** antes de commitear: en la defensa explicamos nosotros, no Claude.

## Checklist antes de abrir un PR

- [ ] Cada archivo nuevo tiene la cabecera `QUÉ ES / NIVEL / DÓNDE SE USA`.
- [ ] Cada función tiene JSDoc.
- [ ] El controller no tiene lógica: solo llama al service.
- [ ] Los imports propios terminan en `.js`.
- [ ] `npm run build`, `npm run lint` y `npm test` pasan.
- [ ] Probé los endpoints nuevos (Postman o `curl`).
- [ ] La rama sale de `dev` y el PR apunta a `dev`.
