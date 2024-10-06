import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";
import { NotesService } from "./notes.service";

@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.notesService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.notesService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }
}
