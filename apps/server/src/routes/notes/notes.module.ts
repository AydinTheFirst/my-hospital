import { Module } from "@nestjs/common";

import { FilesModule } from './files/files.module';
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";

@Module({
  controllers: [NotesController],
  imports: [FilesModule],
  providers: [NotesService],
})
export class NotesModule {}
