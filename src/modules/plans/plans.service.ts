import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service.js';
import { CreatePlanDto } from './dto/create-plan.dto.js';
import { UpdatePlanDto } from './dto/update-plan.dto.js';
import { Plan } from './entities/plan.entity.js';

// QUÉ ES: el servicio de planes: listar, buscar, crear, editar y borrar.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: PlansController lo recibe por inyección de dependencias.

// Los errores de la base (id repetido, plan en uso) no se manejan acá:
// los traduce PrismaExceptionFilter a 409 o 404 para todos los módulos.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class PlansService {
  // Nest crea PrismaService y lo pasa acá solo (inyección de dependencias).
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todos los planes, ordenados por nombre.
   * @returns La lista de planes (vacía si no hay ninguno).
   */
  findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany({ orderBy: { name: 'asc' } });
  }

  /**
   * Busca un plan por su id.
   * @param id - El id del plan, por ejemplo 'familiar'.
   * @returns El plan encontrado.
   * @throws NotFoundException si no existe un plan con ese id.
   */
  async findOne(id: string): Promise<Plan> {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    // findUnique devuelve null si no lo encuentra. NotFoundException hace que
    // Nest responda 404 con este mensaje.
    if (!plan) throw new NotFoundException('No existe un plan con ese id');
    return plan;
  }

  /**
   * Crea un plan nuevo.
   * @param createPlanDto - Los datos del plan que llegaron en el body.
   * @returns El plan creado.
   */
  create(createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.prisma.plan.create({ data: createPlanDto });
  }

  /**
   * Edita los campos que llegaron de un plan existente.
   * @param id - El id del plan a editar.
   * @param updatePlanDto - Solo los campos que cambian.
   * @returns El plan ya editado.
   * @throws NotFoundException si no existe un plan con ese id.
   */
  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    await this.findOne(id);
    return this.prisma.plan.update({ where: { id }, data: updatePlanDto });
  }

  /**
   * Borra un plan.
   * @param id - El id del plan a borrar.
   * @returns El plan borrado.
   * @throws NotFoundException si no existe un plan con ese id.
   */
  async remove(id: string): Promise<Plan> {
    await this.findOne(id);
    return this.prisma.plan.delete({ where: { id } });
  }
}
