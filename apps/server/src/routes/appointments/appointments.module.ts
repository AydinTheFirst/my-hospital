import { Module } from "@nestjs/common";

import { DoctorsService } from "@/routes/doctors/doctors.service";

import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DoctorsService],
})
export class AppointmentsModule {}
