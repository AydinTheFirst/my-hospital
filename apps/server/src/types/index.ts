export type * from "@prisma/client";

export type DoctorCalendar = DoctorCalendarDay[];

export interface DoctorCalendarDay {
  date: Date;
  hours: DoctorCalendarHour[];
  isAvailable: boolean;
}

export interface DoctorCalendarHour {
  hour: string;
  isAvailable: boolean;
}
