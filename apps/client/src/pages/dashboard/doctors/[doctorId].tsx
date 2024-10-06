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
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Doctor, Profession, User } from "@/types";

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
    </section>
  );
};

export default ViewDoctor;
