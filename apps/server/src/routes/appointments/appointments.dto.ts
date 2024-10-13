import { PartialType } from "@nestjs/swagger";
import { AppointmentStatus } from "@prisma/client";
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
  status: AppointmentStatus;

  @IsString()
  title: string;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
