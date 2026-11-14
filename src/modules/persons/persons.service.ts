import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { Person } from './entities/person.entity.js';

// QUÉ ES: el servicio de personas: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PersonsController lo recibe por inyección de dependencias.

// Los errores de la base (DNI repetido, persona en uso) no se manejan acá:
// los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// Las fechas llegan en el body como texto ('1990-07-08'), pero Prisma necesita
// un Date para una columna DATE: por eso se convierten con new Date(...).

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PersonsService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todas las personas, ordenadas por apellido y nombre.
   * @returns La lista de personas (vacía si no hay ninguna).
   */
  findAll(): Promise<Person[]> {
    return this.prisma.person.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  /**
   * Busca una persona por su id.
   * @param id - El id de la persona, por ejemplo 1.
   * @returns La persona encontrada.
   * @throws NotFoundException si no existe una persona con ese id.
   */
  async findOne(id: number): Promise<Person> {
    const person = await this.prisma.person.findUnique({ where: { id } });
    // findUnique devuelve null si no la encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!person)
      throw new NotFoundException('No existe una persona con ese id');
    return person;
  }

  /**
   * Crea una persona nueva.
   * @param createPersonDto - Los datos de la persona que llegaron en el body.
   * @returns La persona creada.
   */
  create(createPersonDto: CreatePersonDto): Promise<Person> {
    const { birthDate, ...data } = createPersonDto;
    return this.prisma.person.create({
      data: { ...data, birthDate: new Date(birthDate) },
    });
  }

  /**
   * Edita los campos que llegaron de una persona existente.
   * @param id - El id de la persona a editar.
   * @param updatePersonDto - Solo los campos que cambian.
   * @returns La persona ya editada.
   * @throws NotFoundException si no existe una persona con ese id.
   */
  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    await this.findOne(id);
    const { birthDate, ...data } = updatePersonDto;
    return this.prisma.person.update({
      where: { id },
      // Si no vino la fecha, queda undefined y Prisma no toca la columna.
      data: { ...data, birthDate: birthDate ? new Date(birthDate) : undefined },
    });
  }

  /**
   * Borra una persona.
   * Si la persona tiene inscripciones, aptos o abonos, la base no deja borrarla (409).
   * @param id - El id de la persona a borrar.
   * @returns La persona borrada.
   * @throws NotFoundException si no existe una persona con ese id.
   */
  async remove(id: number): Promise<Person> {
    await this.findOne(id);
    return this.prisma.person.delete({ where: { id } });
  }
}
