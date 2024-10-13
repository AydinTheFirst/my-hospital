import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  Calendar,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  cn,
  DateValue,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import http from "@/http";
import { Appointment, Doctor, DoctorCalendar, Profession, User } from "@/types";
import { localeDate } from "@/utils";

const Randevular = () => {
  const { data: randevular } = useSWR<Appointment[]>("/appointments");

  if (!randevular) return "Yükleniyor...";

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {randevular.map((appointment) => (
          <div
            className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
            key={appointment.id}
          >
            <AppointmentCard appointment={appointment} />
          </div>
        ))}
      </div>

      <CreateAppointment />
    </>
  );
};

export default Randevular;

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const { data: doctor } = useSWR<Doctor>(`/doctors/${appointment.doctorId}`);
  const { data: profession } = useSWR<Profession>(
    doctor ? `/professions/${doctor.professionId}` : null,
  );

  const Status = () => {
    switch (appointment.status) {
      case "PENDING":
        return <span className="text-yellow-500">Beklemede</span>;
      case "ACCEPTED":
        return <span className="text-green-500">Onaylandı</span>;
      case "CANCELLED":
        return <span className="text-red-500">İptal Edildi</span>;
      case "REJECTED":
        return <span className="text-red-500">Reddedildi</span>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold">
              {localeDate(appointment.date)}
            </h4>
          </div>
          <div>
            <h4 className="text-lg font-bold">{appointment.hour}</h4>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <ul>
          <li>
            <strong>Doktor:</strong>
            <p>{doctor ? doctor.name : "..."}</p>
          </li>
          <li>
            <strong>Uzmanlık Alanı:</strong>
            <p>{profession ? profession.name : "..."}</p>
          </li>
        </ul>
      </CardBody>
      <CardBody>
        <Status />
      </CardBody>
    </Card>
  );
};

const CreateAppointment = () => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [calendar, setCalendar] = useState<DoctorCalendar>();

  const { data: doctors } = useSWR<Doctor[]>("/doctors");
  const { data: professions } = useSWR<Profession[]>("/professions");
  const { data: me } = useSWR<User>("/auth/me");

  useEffect(() => {
    if (!selectedDoctor) return;
    const fetchCalendar = async () => {
      const { data } = await http.get<DoctorCalendar>(
        `/doctors/${selectedDoctor}/calendar`,
      );
      setCalendar(data);
    };

    fetchCalendar();
  }, [selectedDoctor]);

  const doctorsByProfession = doctors
    ? doctors.filter((doctor) => doctor.professionId === selectedProfession)
    : [];

  const availableDays = useMemo(() => {
    if (!calendar) return null;

    const availableDays = calendar.filter((day) => day.isAvailable);
    console.log(availableDays);
    return availableDays;
  }, [calendar]);

  const availableHours = useMemo(() => {
    if (!calendar) return null;

    const selectedDay = calendar.find(
      (day) => new Date(day.date).toDateString() === selectedDate,
    );

    return selectedDay ? selectedDay.hours.filter((h) => h.isAvailable) : null;
  }, [calendar, selectedDate]);

  const isDateUnavailable = (date: DateValue) => {
    if (!availableDays) return true;

    const day = availableDays.find(
      (day) =>
        new Date(day.date).toDateString() ===
        date.toDate(getLocalTimeZone()).toDateString(),
    );

    return !day;
  };

  const HoursInput = () => {
    const [selectedHour, setSelectedHour] = useState<string>();

    if (!availableHours) return null;

    return (
      <>
        <div className="grid grid-cols-12 gap-5">
          {availableHours.map((hour) => (
            <Checkbox
              aria-label={hour.hour}
              className={cn(
                "inline-flex w-full max-w-md bg-content1",
                "items-center justify-start hover:bg-content2",
                "cursor-pointer gap-2 rounded-lg border-2 border-transparent p-4",
                "data-[selected=true]:border-primary",
                "col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2",
              )}
              isSelected={selectedHour === hour.hour}
              onValueChange={(val) =>
                setSelectedHour(val ? hour.hour : undefined)
              }
            >
              <div className="flex w-full justify-between gap-2">
                <span>{hour.hour}</span>
              </div>
            </Checkbox>
          ))}
        </div>
        <input name="hour" type="hidden" value={selectedHour} />
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    data.doctorId = selectedDoctor;
    data.patientId = me!.id;
    data.date = new Date(selectedDate).toISOString();

    try {
      await http.post("/appointments", data);
      location.reload();
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Card>
      <CardBody>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input
            defaultValue="Genel Muayene"
            isRequired
            label="Randevu Başlığı"
            name="title"
          />

          {professions && (
            <Select
              isRequired
              label="Uzmanlık Alanı"
              name="profession"
              onChange={(e) => setSelectedProfession(e.target.value)}
            >
              {professions.map((profession) => (
                <SelectItem key={profession.id} value={profession.id}>
                  {profession.name}
                </SelectItem>
              ))}
            </Select>
          )}

          {selectedProfession && (
            <Select
              isRequired
              label="Doktor"
              name="doctor"
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {doctorsByProfession.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </Select>
          )}

          {selectedDoctor && availableDays && (
            <>
              <Calendar
                isDateUnavailable={isDateUnavailable}
                maxValue={today(getLocalTimeZone()).add({ days: 30 })}
                minValue={today(getLocalTimeZone()).add({ days: 1 })}
                onChange={(date) =>
                  setSelectedDate(
                    date.toDate(getLocalTimeZone()).toDateString(),
                  )
                }
              />
              <input name="date" type="hidden" value={selectedDate} />
            </>
          )}

          {selectedDate && availableHours && <HoursInput />}

          <Button color="primary" fullWidth type="submit">
            Randevu Oluştur
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
