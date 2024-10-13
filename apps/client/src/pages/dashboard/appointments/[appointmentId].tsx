import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Appointment, Doctor, User } from "@/types";
import { getDefaultDateValue } from "@/utils";

const ViewAppointment = () => {
  const navigate = useNavigate();

  const { appointmentId } = useParams<{ appointmentId: string }>();
  const isNew = appointmentId === "new";

  const { data: appointment, isLoading } = useSWR<Appointment>(
    isNew ? null : `/appointments/${appointmentId}`,
  );
  const { data: users } = useSWR<User[]>("/users");
  const { data: doctors } = useSWR<Doctor[]>("/doctors");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await (isNew
        ? http.post("/appointments", data)
        : http.patch(`/appointments/${appointmentId}`, data));

      toast.success(
        isNew
          ? "Randevu başarıyla oluşturuldu!"
          : "Randevu başarıyla güncellendi!",
      );
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu randevuyu silmek istiyor musunuz?")) return;

    try {
      await http.delete(`/appointments/${appointmentId}`);
      toast.success("Randevu başarıyla silindi!");
      navigate("/dashboard/appointments");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return "Yükleniyor...";

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {isNew
              ? "Randevu Oluştur"
              : `Randevu: ${appointment?.title} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={appointment?.title}
              isRequired
              label="Başlık"
              name="title"
            />

            <Input
              className="col-span-12"
              defaultValue={getDefaultDateValue(appointment?.date)}
              isRequired
              label="Tarih"
              name="date"
              type="date"
            />

            <Input
              className="col-span-12"
              defaultValue={appointment?.hour}
              isRequired
              label="Saat"
              name="hour"
              type="time"
            />

            <Select
              className="col-span-12"
              defaultSelectedKeys={[appointment?.doctorId || ""]}
              isRequired
              label="Doktor"
              name="doctorId"
            >
              {doctors ? (
                doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="loading">Yükleniyor...</SelectItem>
              )}
            </Select>
            <Select
              className="col-span-12"
              defaultSelectedKeys={[appointment?.patientId || ""]}
              isRequired
              label="Hasta"
              name="patientId"
            >
              {users ? (
                users.map((user) => (
                  <SelectItem
                    key={user.id}
                    textValue={user.firstName}
                    value={user.id}
                  >
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="loading">Yükleniyor...</SelectItem>
              )}
            </Select>
            <Select
              className="col-span-12"
              defaultSelectedKeys={[appointment?.status || "pending"]}
              isRequired
              label="Durum"
              name="status"
            >
              {["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"].map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ),
              )}
            </Select>
            <Textarea
              className="col-span-12"
              defaultValue={appointment?.description || ""}
              label="Açıklama"
              name="description"
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
    </section>
  );
};

export default ViewAppointment;
