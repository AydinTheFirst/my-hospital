import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";
import { DoctorCalendar, DoctorCalendarHour } from "@/types";

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

  // ilerideki 1 ay için uygun saatleri bulmak için kullanılacak
  async getCalendar(id: string) {
    const doctor = await this.isExists(id);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
    });

    const doctorCalendar: DoctorCalendar = [];

    // loop through each day in the next month
    // and check if the doctor is available and if there are no appointments and off dates
    // 9 am to 5 pm

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 30);

    for (
      const date = new Date();
      date < endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDay();
      const isWeekend = day === 0 || day === 6;
      const isOffDate = doctor.offDates.find((offDate) => {
        const offDateObj = new Date(offDate);
        return offDateObj.toDateString() === date.toDateString();
      });

      if (isWeekend) {
        continue;
      }

      const appointmentsOnDate = appointments.filter(
        (appointment) =>
          new Date(appointment.date).toDateString() ===
          new Date(date).toDateString()
      );

      const availableHoursOnDate: DoctorCalendarHour[] = [];
      const [startHour, endHour] = doctor.workingHours.split("-");

      for (let hour = +startHour; hour < +endHour; hour++) {
        const isAvailable = !appointmentsOnDate.some(
          (appointment) => appointment.hour.split(":")[0] === hour.toString()
        );

        availableHoursOnDate.push({
          hour: `${hour}:00`,
          isAvailable,
        });
      }

      doctorCalendar.push({
        date: new Date(date),
        hours: availableHoursOnDate,
        isAvailable: !isOffDate,
      });
    }

    console.log(doctorCalendar);

    return doctorCalendar;
  }

  async isAvailable(id: string, date: Date, hour: string) {
    const doctor = await this.isExists(id);

    const doctorCalendar = await this.getCalendar(doctor.id);

    const workingDay = doctorCalendar.find(
      (workingDay) =>
        new Date(workingDay.date).toDateString() ===
        new Date(date).toDateString()
    );

    if (!workingDay) {
      return false;
    }

    if (!workingDay.isAvailable) {
      return false;
    }

    const workingHour = workingDay.hours.find(
      (workingHour) => workingHour.hour === hour
    );

    if (workingHour && !workingHour.isAvailable) {
      return false;
    }

    return true;
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
