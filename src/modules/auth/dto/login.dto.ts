import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para iniciar sesión.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: AuthController lo recibe en POST /api/auth/login.

export class LoginDto {
  // @IsEmail responde 400 si el texto no tiene forma de email.
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  // Acá no se pide un largo mínimo: eso se valida al registrarse.
  @IsString()
  @IsNotEmpty()
  password: string;
}
