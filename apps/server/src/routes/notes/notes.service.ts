import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateNoteDto, UpdateNoteDto } from "./notes.dto";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}
  async create(createNoteDto: CreateNoteDto) {
    const note = await this.prisma.note.create({
      data: {
        ...createNoteDto,
      },
    });

    return note;
  }

  async findAll() {
    const notes = await this.prisma.note.findMany();

    return notes;
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    return note;
  }

  async remove(id: string) {
    const isExist = await this.prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!isExist) {
      throw new NotFoundException("Note not found");
    }

    await this.prisma.note.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    await this.prisma.note.update({
      data: {
        ...updateNoteDto,
      },
      where: {
        id: id,
      },
    });

    return true;
  }
}
