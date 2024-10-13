import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  Button,
  Calendar,
  Card,
  CardBody,
  Checkbox,
  cn,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { LucideCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import http from "@/http";
import { Doctor, DoctorCalendar, Profession, User } from "@/types";
import { localeDate } from "@/utils";

export const CreateAppointment = () => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [currentStep, setCurrentStep] = useState<string>("profession");
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
              onValueChange={() => setSelectedHour(hour.hour)}
            >
              <div className="flex w-full justify-between gap-2">
                <span>{hour.hour}</span>
              </div>
            </Checkbox>
          ))}
        </div>
      </>
    );
  };

  const AppointmentForm = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const data = Object.fromEntries(form.entries());

      data.date = new Date(selectedDate).toISOString();

      try {
        await http.post("/appointments", data);
        location.reload();
      } catch (error) {
        http.handleError(error);
      }
    };

    const doctor = doctors?.find((d) => d.id === selectedDoctor);
    const profession = professions?.find((p) => p.id === selectedProfession);

    return (
      <Card>
        <CardBody>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <input name="doctorId" type="hidden" value={selectedDoctor} />
            <input name="patientId" type="hidden" value={me?.id} />

            <Input label="Randevu Başlığı" name="title" value="Genel Muayene" />

            <Input
              isReadOnly
              label="Hasta"
              value={me ? `${me.firstName} ${me.lastName}` : "Lütfen Seçiniz"}
            />

            <Input
              isInvalid={!selectedProfession}
              label="Poliklinik"
              value={profession ? profession.name : "Lütfen seçiniz"}
            />

            <Input
              isInvalid={!doctor}
              label="Doktor"
              value={doctor ? doctor.name : "Lütfen seçiniz"}
            />

            <Input
              defaultValue={localeDate(selectedDate)}
              isInvalid={!selectedDate}
              label="Tarih"
            />

            <Input
              isInvalid={!selectedHour}
              label="Saat"
              name="hour"
              value={selectedHour}
            />

            <Button color="primary" fullWidth type="submit">
              Randevu Oluştur
            </Button>
          </form>
        </CardBody>
      </Card>
    );
  };

  const handleStepChange = (forward: boolean) => {
    const steps = ["profession", "doctor", "date", "hour", "appointment"];
    const currentIndex = steps.indexOf(currentStep);
    const nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
    setCurrentStep(steps[nextIndex]);
  };

  return (
    <section className="grid grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-6">
        <AppointmentForm />
      </div>
      <div className="col-span-12 md:col-span-6">
        <Card>
          <CardBody className="grid gap-3">
            <Accordion selectedKeys={[currentStep]}>
              <AccordionItem
                key={"profession"}
                startContent={selectedProfession ? <LucideCheck /> : ""}
                title="Poliklinik"
              >
                {professions && (
                  <Select
                    isRequired
                    label="Poliklinik"
                    name="profession"
                    onChange={(e) => {
                      setSelectedProfession(e.target.value);
                      handleStepChange(true);
                    }}
                    selectedKeys={[selectedProfession]}
                  >
                    {professions.map((profession) => (
                      <SelectItem key={profession.id} value={profession.id}>
                        {profession.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </AccordionItem>
              <AccordionItem
                key={"doctor"}
                startContent={selectedDoctor ? <LucideCheck /> : ""}
                title="Doktor"
              >
                <Select
                  isRequired
                  label="Doktor"
                  name="doctor"
                  onChange={(e) => {
                    setSelectedDoctor(e.target.value);
                    handleStepChange(true);
                  }}
                  selectedKeys={[selectedDoctor]}
                >
                  {doctorsByProfession.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </Select>
              </AccordionItem>
              <AccordionItem
                key={"date"}
                startContent={selectedDate ? <LucideCheck /> : ""}
                title="Tarih"
              >
                <Calendar
                  isDateUnavailable={isDateUnavailable}
                  maxValue={today(getLocalTimeZone()).add({ days: 30 })}
                  minValue={today(getLocalTimeZone()).add({ days: 1 })}
                  onChange={(date) => {
                    setSelectedDate(
                      date.toDate(getLocalTimeZone()).toDateString(),
                    );
                    handleStepChange(true);
                  }}
                  value={
                    selectedDate
                      ? today(getLocalTimeZone()).set({
                          day: new Date(selectedDate).getDate(),
                          month: new Date(selectedDate).getMonth() + 1,
                          year: new Date(selectedDate).getFullYear(),
                        })
                      : undefined
                  }
                />
              </AccordionItem>
              <AccordionItem
                key={"hour"}
                startContent={selectedHour ? <LucideCheck /> : ""}
                title="Saat"
              >
                <HoursInput />
              </AccordionItem>
            </Accordion>
            <CardBody>
              <Button
                color="primary"
                fullWidth
                onClick={() => handleStepChange(true)}
              >
                İleri
              </Button>

              <Button
                color="danger"
                fullWidth
                onClick={() => handleStepChange(false)}
              >
                Geri
              </Button>
            </CardBody>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default CreateAppointment;
