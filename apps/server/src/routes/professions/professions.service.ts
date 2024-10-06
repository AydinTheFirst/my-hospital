import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateProfessionDto, UpdateProfessionDto } from "./professions.dto";

@Injectable()
export class ProfessionsService {
  constructor(private prisma: PrismaService) {}
  async create(createProfessionDto: CreateProfessionDto) {
    const profession = await this.prisma.profession.create({
      data: createProfessionDto,
    });

    return profession;
  }

  async findAll() {
    const professions = await this.prisma.profession.findMany();
    return professions;
  }

  async findOne(id: string) {
    const profession = await this.isExists(id);
    return profession;
  }

  async isExists(id: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { id },
    });

    if (!profession) {
      throw new NotFoundException("Profession not found");
    }

    return profession;
  }

  async remove(id: string) {
    await this.isExists(id);

    await this.prisma.profession.delete({
      where: { id },
    });

    return true;
  }

  async update(id: string, updateProfessionDto: UpdateProfessionDto) {
    await this.isExists(id);

    const profession = await this.prisma.profession.update({
      data: updateProfessionDto,
      where: { id },
    });

    return profession;
  }
}
