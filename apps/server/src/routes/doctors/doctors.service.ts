import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateDoctorDto, UpdateDoctorDto } from "./doctors.dto";

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const { professionId, ...doctorData } = createDoctorDto;

    const doctor = await this.prisma.doctor.create({
      data: {
        ...doctorData,
        profession: {
          connect: {
            id: professionId,
          },
        },
      },
    });

    return doctor;
  }

  async findAll() {
    const doctors = await this.prisma.doctor.findMany();
    return doctors;
  }

  async findOne(id: string) {
    const doctor = await this.isExists(id);
    return doctor;
  }

  async isExists(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return doctor;
  }

  async remove(id: string) {
    await this.isExists(id);

    await this.prisma.doctor.delete({
      where: { id },
    });

    return true;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    await this.isExists(id);

    const { professionId, ...doctorData } = updateDoctorDto;

    const doctor = await this.prisma.doctor.update({
      data: {
        ...doctorData,
        profession: {
          connect: {
            id: professionId,
          },
        },
      },
      where: { id },
    });

    return doctor;
  }
}
