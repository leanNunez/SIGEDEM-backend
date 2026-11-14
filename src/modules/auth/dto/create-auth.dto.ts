import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para ingresar al sistema.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: AuthController lo recibe en POST /api/auth.
// A FUTURO: AuthService va a comparar estos datos con la tabla users (login).

// Hace falta declarar los campos aunque el login no esté hecho: ValidationPipe
// rechaza (400) cualquier campo que el DTO no declare.
export class CreateAuthDto {
  // @IsEmail responde 400 si el texto no tiene forma de email.
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  // Acá no se pide un largo mínimo: eso se valida al crear el usuario.
  @IsString()
  @IsNotEmpty()
  password: string;
}
