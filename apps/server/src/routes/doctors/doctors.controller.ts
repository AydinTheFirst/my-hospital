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

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateDoctorDto, UpdateDoctorDto } from "./doctors.dto";
import { DoctorsService } from "./doctors.service";

@Controller("doctors")
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.doctorsService.findOne(id);
  }

  @Get(":id/calendar")
  getCalendar(@Param("id") id: string) {
    return this.doctorsService.getCalendar(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  remove(@Param("id") id: string) {
    return this.doctorsService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  update(@Param("id") id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }
}
