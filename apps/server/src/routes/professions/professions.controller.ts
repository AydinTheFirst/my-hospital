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

import { CreateProfessionDto, UpdateProfessionDto } from "./professions.dto";
import { ProfessionsService } from "./professions.service";

@Controller("professions")
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionsService.create(createProfessionDto);
  }

  @Get()
  findAll() {
    return this.professionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.professionsService.findOne(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  remove(@Param("id") id: string) {
    return this.professionsService.remove(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @Roles(["ADMIN"])
  update(
    @Param("id") id: string,
    @Body() updateProfessionDto: UpdateProfessionDto
  ) {
    return this.professionsService.update(id, updateProfessionDto);
  }
}
