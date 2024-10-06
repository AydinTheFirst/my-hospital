import { BadRequestException, Injectable } from "@nestjs/common";

import { Appointment, PrismaService, Role, User } from "@/prisma";

import { CreateAppointmentDto, UpdateAppointmentDto } from "./appointments.dto";

@Injectable()
export class AppointmentsService {
  adminRoles: Role[] = ["ADMIN", "DOCTOR"];
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    await this.isAllowed(user);

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: createAppointmentDto.doctorId },
    });

    if (!doctor) throw new BadRequestException("Doktor bulunamadı!");

    const appointment = await this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        date: new Date(createAppointmentDto.date),
      },
    });

    return appointment;
  }

  async findAll(user: User) {
    let whereClause = {};

    switch (true) {
      case this.adminRoles.some((role) => user.roles.includes(role)):
        whereClause = {};
        break;
      case user.roles.includes("DOCTOR"):
        whereClause = { doctorId: user.id };
        break;
      case user.roles.includes("USER"):
        whereClause = { userId: user.id };
        break;
      default:
        throw new BadRequestException("Bu işlemi yapmaya yetkiniz yok");
    }

    const appointments = await this.prisma.appointment.findMany({
      where: whereClause,
    });

    return appointments;
  }

  async findMany() {
    const appointments = await this.prisma.appointment.findMany();
    return appointments;
  }

  async findOne(id: string, user: User) {
    const appointment = await this.isExist(id);

    await this.isAllowed(user, appointment);

    return appointment;
  }

  async isAllowed(user: User, appointment?: Appointment) {
    if (this.adminRoles.some((role) => user.roles.includes(role))) return true;

    if (!appointment) return true;

    if (user.roles.includes("DOCTOR")) {
      if (appointment.doctorId !== user.id) {
        throw new BadRequestException("Bu işlemi yapmaya yetkiniz yok");
      }

      return true;
    }

    if (user.roles.includes("USER")) {
      if (appointment.patientId !== user.id) {
        throw new BadRequestException("Bu işlemi yapmaya yetkiniz yok");
      }

      return true;
    }

    throw new BadRequestException("Bu işlemi yapmaya yetkiniz yok");
  }

  async isExist(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) throw new BadRequestException("Randevu bulunamadı!");

    return appointment;
  }

  async remove(id: string, user: User) {
    const appointment = await this.isExist(id);

    await this.isAllowed(user, appointment);

    await this.prisma.appointment.delete({
      where: { id },
    });

    return true;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    user: User
  ) {
    const appointment = await this.isExist(id);

    await this.isAllowed(user, appointment);

    const updated = await this.prisma.appointment.update({
      data: {
        ...updateAppointmentDto,
        date: new Date(updateAppointmentDto.date),
      },
      where: { id },
    });

    return updated;
  }
}
