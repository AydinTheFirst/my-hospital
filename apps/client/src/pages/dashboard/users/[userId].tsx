import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Selection,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { User } from "@/types";
import { getDefaultDateValue } from "@/utils";

const ViewUser = () => {
  const navigate = useNavigate();

  const { userId } = useParams<{ userId: string }>();
  const isNew = userId === "new";
  const { data: user, isLoading } = useSWR<User>(
    isNew ? null : `/users/${userId}`,
  );

  const [userRoles, setUserRoles] = useState<Selection>(new Set());

  useEffect(() => {
    if (!user) return;
    setUserRoles(new Set(user.roles));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    data.roles = Array.from(userRoles);

    try {
      await (isNew
        ? http.post("/auth/register", data)
        : http.patch(`/users/${userId}`, data));

      toast.success(
        isNew
          ? "Kullanıcı başarıyla oluşturuldu!"
          : "Kullanıcı başarıyla güncellendi!",
      );
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinize emin misiniz?",
    );
    if (!confirm) return;

    try {
      await http.delete(`/users/${userId}`);
      toast.success("Kullanıcı başarıyla silindi!");
      navigate("/dashboard/users");
    } catch (error) {
      http.handleError(error);
    }
  };

  if (isLoading) return;

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {isNew
              ? "Kullanıcı oluştur"
              : `Kullanıcı: ${user?.username} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            {!isNew && (
              <Input
                className="col-span-12 md:col-span-6"
                defaultValue={user?.username}
                isRequired
                label="Kullanıcı adı"
                name="username"
              />
            )}

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.email}
              isRequired
              label="Email"
              name="email"
              type="email"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.firstName}
              isRequired
              label="İsim"
              name="firstName"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.lastName}
              isRequired
              label="Soyisim"
              name="lastName"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.nationalId}
              isRequired
              label="T.C. Kimlik Numarası"
              maxLength={11}
              minLength={11}
              name="nationalId"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={getDefaultDateValue(user?.birthDate)}
              isRequired
              label="Doğum Tarihi"
              name="birthDate"
              type="date"
            />

            <Input
              className="col-span-12 md:col-span-6"
              defaultValue={user?.phoneNumber}
              label="Telefon"
              name="phoneNumber"
            />

            {!isNew && (
              <Select
                className="col-span-12 md:col-span-6"
                label="Roller"
                name="roles"
                onSelectionChange={setUserRoles}
                selectedKeys={userRoles}
                selectionMode="multiple"
              >
                {["DOCTOR", "USER"].map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
            )}

            <Input
              className="col-span-12 md:col-span-6"
              label="Şifre"
              name="password"
            />

            <Textarea
              className="col-span-12"
              defaultValue={user?.address || ""}
              label="Adres"
              name="address"
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

export default ViewUser;
