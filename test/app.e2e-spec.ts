import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/modules/app/app.module.js';
import { setupApp } from './../src/shared/config/setup-app.js';

// QUÉ ES: los tests end-to-end: levantan la API entera y le mandan pedidos HTTP.
// NIVEL: test — prueba las rutas como lo haría Postman, con la misma configuración.
// DÓNDE SE USA: los corre npm run test:e2e.

// Un body válido para POST /api/plans (los mismos datos que usa Postman).
const NEW_PLAN = {
  id: 'natacion-verano',
  name: 'Natación verano',
  type: 'individual',
  people: '1 persona',
  description: 'Plan de prueba para la temporada de verano.',
};

// Un body válido para POST /api/bookings.
const NEW_BOOKING = {
  courtId: 'futbol-7',
  date: '2026-11-20',
  hour: 19,
  fullName: 'Pedro Ledesma',
  dni: '29123456',
  phone: '381 555-0201',
  price: 36000,
};

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp aplica el ValidationPipe, igual que cuando la API arranca en serio.
    setupApp(app);
    await app.init();
  });

  it('responde 404 en una ruta que no existe', () => {
    return request(app.getHttpServer()).get('/api/no-existe').expect(404);
  });

  it('POST /api/plans responde 201 con un body válido', () => {
    return request(app.getHttpServer())
      .post('/api/plans')
      .send(NEW_PLAN)
      .expect(201);
  });

  it('POST /api/plans responde 400 si falta un campo obligatorio', () => {
    const { name: _name, ...withoutName } = NEW_PLAN;
    return request(app.getHttpServer())
      .post('/api/plans')
      .send(withoutName)
      .expect(400);
  });

  it('POST /api/plans responde 400 si llega un campo que el DTO no declara', () => {
    return request(app.getHttpServer())
      .post('/api/plans')
      .send({ ...NEW_PLAN, price: 15000 })
      .expect(400);
  });

  it('POST /api/courts responde 400 si llega texto donde va un número', () => {
    return request(app.getHttpServer())
      .post('/api/courts')
      .send({
        id: 'futbol-9',
        activity: 'futbol',
        name: 'Fútbol 9',
        detail: 'Cancha de prueba',
        units: 'una',
        memberPrice: 20000,
        publicPrice: 30000,
      })
      .expect(400);
  });

  it('POST /api/bookings responde 400 si la fecha no existe', () => {
    return request(app.getHttpServer())
      .post('/api/bookings')
      .send({ ...NEW_BOOKING, date: '2026-02-30' })
      .expect(400);
  });

  it('POST /api/bookings responde 400 si la fecha trae hora y zona horaria', () => {
    return request(app.getHttpServer())
      .post('/api/bookings')
      .send({ ...NEW_BOOKING, date: '2026-12-01T23:00:00-03:00' })
      .expect(400);
  });

  it('POST /api/bookings responde 400 si isMember no es booleano', () => {
    return request(app.getHttpServer())
      .post('/api/bookings')
      .send({ ...NEW_BOOKING, isMember: 'si' })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
