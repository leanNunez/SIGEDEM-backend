import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// QUÉ ES: los datos que hay que mandar en el body para crear un usuario.
// NIVEL: dto — describe lo que entra a la API y valida cada campo.
// DÓNDE SE USA: UsersController lo recibe en POST /api/users.
// Los datos se guardan en la tabla users (ver UsersService).

// Cada decorador repite una regla de la tabla users (database/schema.sql).
// La contraseña llega en texto plano y UsersService la guarda hasheada en la
// columna password_hash: el hash nunca entra ni sale por la API.

// Largo mínimo de la contraseña (regla de la API, la tabla no la tiene).
const PASSWORD_MIN_LENGTH = 8;

export class CreateUserDto {
  // @IsInt + @IsPositive: el id del rol tiene que ser un entero mayor que 0.
  // Si el rol no existe, la FK de la tabla lo rechaza y la API responde 409.
  @IsInt()
  @IsPositive()
  roleId: number;

  // Cada @MaxLength coincide con el VARCHAR de su columna.
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  // @IsEmail revisa que tenga forma de mail (algo@dominio.com).
  // La columna es UNIQUE: un mail repetido responde 409.
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(120)
  email: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `La contraseña tiene que tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
  })
  password: string;

  // @IsOptional deja que el campo no venga; si no viene, la tabla usa TRUE.
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
