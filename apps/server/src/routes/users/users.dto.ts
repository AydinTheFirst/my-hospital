import { Role } from "@prisma/client";
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @IsDateString()
  birthDate: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nationalId: string;

  @IsString()
  password: string;

  @IsPhoneNumber("TR")
  phoneNumber: string;

  @IsArray()
  roles: Role[];

  @IsString()
  username: string;
}

export class UpdateUserDto extends CreateUserDto {}
