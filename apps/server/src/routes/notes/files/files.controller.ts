import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { FilesService } from "./files.service";

@Controller("notes/:noteId/files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Delete(":id")
  remove(@Param() params: { id: string; noteId: string }) {
    return this.filesService.remove(params.noteId, params.id);
  }

  @Put()
  update(@Param("noteId") noteId: string, @Body("files") files: string[]) {
    return this.filesService.update(noteId, files);
  }

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  upload(
    @Param("noteId") noteId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.filesService.upload(noteId, files);
  }
}
