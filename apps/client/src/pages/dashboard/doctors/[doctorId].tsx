import {
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import http from "@/http";
import { Doctor, DoctorCalendar, Profession, User } from "@/types";

const ViewDoctor = () => {
  const navigate = useNavigate();

  const { doctorId } = useParams<{ doctorId: string }>();
  const isNew = doctorId === "new";

  const { data: doctor, isLoading } = useSWR<Doctor>(
    isNew ? null : `/doctors/${doctorId}`,
  );
  const { data: users } = useSWR<User[]>("/users");
  const { data: professions } = useSWR<Profession[]>("/professions");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await (isNew
        ? http.post("/doctors", data)
        : http.patch(`/doctors/${doctorId}`, data));

      toast.success(
        isNew
          ? "Doktor başarıyla oluşturuldu!"
          : "Doktor başarıyla güncellendi!",
      );
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu doktor profilini silmek istiyor musunuz?")) return;

    try {
      await http.delete(`/doctors/${doctorId}`);
      toast.success("Doktor başarıyla silindi!");
      navigate("/dashboard/doctors");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Yükleniyor...";

  const doctors = users
    ? users.filter((user) => user.roles.includes("DOCTOR"))
    : [];

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {isNew ? "Doktor Oluştur" : `Doktor: ${doctor?.name} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={doctor?.name}
              isRequired
              label="Doktor İsmi"
              name="name"
            />

            <Select
              className="col-span-12 md:col-span-6"
              defaultSelectedKeys={[doctor?.userId || ""]}
              isRequired
              label="Kullanıcı"
              name="userId"
            >
              {doctors.map((user) => (
                <SelectItem
                  key={user.id}
                  textValue={user.firstName}
                  value={user.id}
                >
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </Select>

            <Select
              className="col-span-12 md:col-span-6"
              defaultSelectedKeys={[doctor?.professionId || ""]}
              isRequired
              label="Alan"
              name="professionId"
            >
              {professions ? (
                professions.map((profession) => (
                  <SelectItem key={profession.id} value={profession.id}>
                    {profession.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={"loading"}>Yükleniyor...</SelectItem>
              )}
            </Select>

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={doctor?.workingHours || "9-17"}
              isRequired
              label="Çalışma Saatleri"
              name="workingHours"
            />

            <Textarea
              className="col-span-12"
              defaultValue={doctor?.bio || ""}
              isRequired
              label="Açıklama"
              name="bio"
            />

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              {isNew ? "Oluştur" : "Güncelle"}
            </Button>
          </form>
          {!isNew && (
            <div className="mt-3 flex justify-end">
              <Button color="danger" onClick={handleDelete}>
                Sil
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      {doctor && <AddDayOffs doctor={doctor} />}
      {doctor && <AvailableTimes />}
    </section>
  );
};

export default ViewDoctor;

const AddDayOffs = ({ doctor }: { doctor: Doctor }) => {
  const { doctorId } = useParams<{ doctorId: string }>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await http.patch(`/doctors/${doctorId}`, {
        ...doctor,
        offDates: Array.from(
          new Set(
            [
              ...doctor.offDates,
              new Date(data.date as string).toISOString(),
            ].filter(Boolean),
          ),
        ),
      });
      toast.success("Tatil günü başarıyla eklendi!");
      mutate(`/doctors/${doctorId}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  const deleteOffDate = async (date: string) => {
    try {
      await http.patch(`/doctors/${doctorId}`, {
        ...doctor,
        offDates: doctor.offDates.filter(
          (offDate) => offDate.toString() !== date,
        ),
      });
      toast.success("Tatil günü başarıyla silindi!");
      mutate(`/doctors/${doctorId}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-semibold">Tatil Günü Ekle</h3>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
          <Input className="col-span-11" isRequired name="date" type="date" />
          <Button
            className="col-span-1"
            color="primary"
            fullWidth
            type="submit"
          >
            Ekle
          </Button>
        </form>
      </CardBody>
      <CardBody className="grid gap-3">
        {doctor.offDates.map((offDate, i) => (
          <div className="flex items-center justify-between gap-3" key={i}>
            <h4>
              {new Date(offDate).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                weekday: "long",
                year: "numeric",
              })}
            </h4>
            <Button
              color="danger"
              onClick={() => deleteOffDate(offDate.toString())}
            >
              Sil
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

const AvailableTimes = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctorCalendar } = useSWR<DoctorCalendar>(
    `/doctors/${doctorId}/calendar`,
  );

  if (!doctorCalendar) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-semibold">Uygun Saatler</h3>
      </CardHeader>
      <CardBody className="grid grid-cols-5 gap-3">
        {doctorCalendar.map((availableTime, i) => (
          <div key={i}>
            <h4
              className={cn(
                "text-xl font-semibold",
                availableTime.isAvailable ? "" : "text-red-500",
              )}
            >
              {new Date(availableTime.date).toLocaleString("tr-TR", {
                day: "numeric",
                month: "long",
                weekday: "long",
                year: "numeric",
              })}
            </h4>
            <ul className="mt-2 grid gap-2">
              {availableTime.hours.map((hour, i) => (
                <li
                  className={
                    hour.isAvailable && availableTime.isAvailable
                      ? "text-green-500"
                      : "text-red-500"
                  }
                  key={i}
                >
                  {hour.hour}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
