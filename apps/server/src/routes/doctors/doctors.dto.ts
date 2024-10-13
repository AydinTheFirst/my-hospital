import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateDoctorDto {
  @IsString()
  bio: string;

  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  offDates: string[];

  @IsString()
  professionId: string;

  @IsString()
  userId: string;

  @IsString()
  workingHours: string;
}

export class UpdateDoctorDto extends CreateDoctorDto {}
