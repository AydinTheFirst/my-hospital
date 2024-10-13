import { BadRequestException, Injectable } from "@nestjs/common";

import { Appointment, PrismaService, Role, User } from "@/prisma";
import { DoctorsService } from "@/routes/doctors/doctors.service";

import { CreateAppointmentDto, UpdateAppointmentDto } from "./appointments.dto";

@Injectable()
export class AppointmentsService {
  adminRoles: Role[] = ["ADMIN", "DOCTOR"];
  constructor(
    private prisma: PrismaService,
    private doctorsService: DoctorsService
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    await this.isAllowed(user);

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: createAppointmentDto.doctorId },
    });

    if (!doctor) throw new BadRequestException("Doktor bulunamadı!");

    const isDoctorAvailable = await this.doctorsService.isAvailable(
      doctor.id,
      createAppointmentDto.date,
      createAppointmentDto.hour
    );

    if (!isDoctorAvailable) {
      throw new BadRequestException("Doktor bu saatte uygun değil!");
    }

    // if user appointed in 15 days can't appoint again
    const userAppointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
        },
        patientId: user.id,
      },
    });

    if (userAppointments.length > 0) {
      throw new BadRequestException(
        "15 gün içinde tekrar randevu alamazsınız!"
      );
    }

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

    const isDoctorAvailable = await this.doctorsService.isAvailable(
      appointment.doctorId,
      updateAppointmentDto.date,
      updateAppointmentDto.hour
    );

    if (!isDoctorAvailable && appointment.id !== id) {
      throw new BadRequestException("Doktor bu saatte uygun değil!");
    }

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
