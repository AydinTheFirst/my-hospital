import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "@/common/aws";
import { PrismaService } from "@/prisma";

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service
  ) {}

  async isNoteExist(noteId: string) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    return note;
  }

  async remove(noteId: string, id: string) {
    const note = await this.isNoteExist(noteId);

    await this.s3.deleteFile(id);

    await this.prisma.note.update({
      data: {
        files: note.files.filter((file) => file !== id),
      },
      where: {
        id: noteId,
      },
    });

    return true;
  }

  async update(noteId: string, files: string[]) {
    await this.isNoteExist(noteId);

    await this.prisma.note.update({
      data: {
        files,
      },
      where: {
        id: noteId,
      },
    });

    return true;
  }

  async upload(noteId: string, files: Express.Multer.File[]) {
    const note = await this.isNoteExist(noteId);

    const uploadedFiles = await Promise.all(
      files.map((file) => this.s3.uploadFile(file))
    );

    await this.prisma.note.update({
      data: {
        files: [...note.files, ...uploadedFiles.map((file) => file)],
      },
      where: {
        id: noteId,
      },
    });

    return uploadedFiles;
  }
}
