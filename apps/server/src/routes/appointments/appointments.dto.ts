import { IsDateString, IsString } from "class-validator";

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsString()
  doctorId: string;

  @IsString()
  patientId: string;

  @IsString()
  title: string;
}

export class UpdateAppointmentDto extends CreateAppointmentDto {}
