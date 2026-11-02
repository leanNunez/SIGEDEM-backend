import { Injectable } from '@nestjs/common';

// QUÉ ES: el servicio de la ruta raíz: arma el mensaje de estado de la API.
// NIVEL: service — acá va la lógica; el controller solo recibe y responde.
// DÓNDE SE USA: AppController lo recibe por inyección de dependencias.

// @Injectable() le avisa a Nest que puede crear esta clase y pasarla a
// quien la pida en su constructor.
@Injectable()
export class AppService {
  /**
   * Devuelve el mensaje que confirma que la API está funcionando.
   * @returns El texto 'API de SIGEDEM funcionando'.
   */
  getStatus(): string {
    return 'API de SIGEDEM funcionando';
  }
}
