import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateAppointmentDto, UpdateAppointmentDto } from "./appointments.dto";
import { AppointmentsService } from "./appointments.service";

@Controller("appointments")
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() user: User
  ) {
    return this.appointmentsService.create(createAppointmentDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.appointmentsService.findAll(user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @GetUser() user: User) {
    return this.appointmentsService.findOne(id, user);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @GetUser() user: User) {
    return this.appointmentsService.remove(id, user);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @GetUser() user: User
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, user);
  }
}
