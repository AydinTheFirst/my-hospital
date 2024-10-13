import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateAppointmentDto {
  @IsDateString()
  date: Date;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  doctorId: string;

  @IsString()
  hour: string;

  @IsString()
  patientId: string;

  @IsString()
  title: string;
}

export class UpdateAppointmentDto extends CreateAppointmentDto {}
