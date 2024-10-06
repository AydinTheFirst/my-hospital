import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class LoginDto {
  @IsString()
  password: string;

  @IsString()
  username: string;
}

export class RegisterDto extends LoginDto {
  @IsDateString()
  birthDate: Date;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nationalId: string;

  @IsStrongPassword()
  password: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  username: string;
}
