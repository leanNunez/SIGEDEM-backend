import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';
import { Enrollment } from './entities/enrollment.entity.js';

// QUÉ ES: el servicio de inscripciones: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: EnrollmentsController lo recibe por inyección de dependencias.

// Los errores de la base (formulario cargado dos veces, FK inexistente) no se
// manejan acá: los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// Las fechas llegan en el body como texto ('2026-10-01'), pero Prisma necesita
// un Date para una columna DATE: por eso se convierten con new Date(...).

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class EnrollmentsService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todas las inscripciones, de la más nueva a la más vieja.
   * @returns La lista de inscripciones (vacía si no hay ninguna).
   */
  findAll(): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({ orderBy: { id: 'desc' } });
  }

  /**
   * Busca una inscripción por su id.
   * @param id - El id de la inscripción, por ejemplo 1.
   * @returns La inscripción encontrada.
   * @throws NotFoundException si no existe una inscripción con ese id.
   */
  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    // findUnique devuelve null si no la encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!enrollment) {
      throw new NotFoundException('No existe una inscripción con ese id');
    }
    return enrollment;
  }

  /**
   * Crea una inscripción nueva.
   * @param createEnrollmentDto - Los datos de la inscripción que llegaron en el body.
   * @returns La inscripción creada.
   */
  create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const { procedureDate, ...data } = createEnrollmentDto;
    return this.prisma.enrollment.create({
      data: { ...data, procedureDate: new Date(procedureDate) },
    });
  }

  /**
   * Edita los campos que llegaron de una inscripción existente.
   * @param id - El id de la inscripción a editar.
   * @param updateEnrollmentDto - Solo los campos que cambian.
   * @returns La inscripción ya editada.
   * @throws NotFoundException si no existe una inscripción con ese id.
   */
  async update(
    id: number,
    updateEnrollmentDto: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    await this.findOne(id);
    const { procedureDate, ...data } = updateEnrollmentDto;
    return this.prisma.enrollment.update({
      where: { id },
      // Si no vino la fecha, queda undefined y Prisma no toca la columna.
      data: {
        ...data,
        procedureDate: procedureDate ? new Date(procedureDate) : undefined,
      },
    });
  }

  /**
   * Borra una inscripción.
   * Si la inscripción tiene pagos o un abono, la base no deja borrarla (409).
   * @param id - El id de la inscripción a borrar.
   * @returns La inscripción borrada.
   * @throws NotFoundException si no existe una inscripción con ese id.
   */
  async remove(id: number): Promise<Enrollment> {
    await this.findOne(id);
    return this.prisma.enrollment.delete({ where: { id } });
  }
}
