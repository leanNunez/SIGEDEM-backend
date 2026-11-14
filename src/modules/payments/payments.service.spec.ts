import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentsService } from './payments.service.js';

// QUÉ ES: los tests unitarios de PaymentsService.
// NIVEL: test — prueba las respuestas provisorias del service (todavía sin base).
// DÓNDE SE USA: los corre npm test.

// Un body válido, como el que llega después de pasar por ValidationPipe.
const NEW_PAYMENT: CreatePaymentDto = {
  enrollmentId: 6,
  amount: 18000,
  paidOn: '2026-11-02',
  operationNumber: 'OP-100008',
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('create devuelve los datos que llegaron en el body', () => {
    expect(service.create(NEW_PAYMENT).data).toEqual(NEW_PAYMENT);
  });

  it('findOne devuelve el id pedido', () => {
    expect(service.findOne(1).id).toBe(1);
  });

  it('update devuelve el id y los cambios', () => {
    expect(
      service.update(1, { status: 'acreditado', verifiedBy: 2 })
    ).toMatchObject({
      id: 1,
      data: { status: 'acreditado', verifiedBy: 2 },
    });
  });
});
