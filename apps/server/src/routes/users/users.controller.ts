import {
  BadRequestException,
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
import { Role } from "@/prisma";

import { UpdateUserDto } from "./users.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(AuthGuard)
@Roles([Role.ADMIN])
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create() {
    throw new BadRequestException(
      "Not implemented. Please use the /auth/register endpoint"
    );
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
