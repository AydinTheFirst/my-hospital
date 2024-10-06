import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR from "swr";

import http from "@/http";
import { Profession } from "@/types";

const ViewProfession = () => {
  const navigate = useNavigate();

  const { professionId } = useParams<{ professionId: string }>();
  const isNew = professionId === "new";

  const { data: profession, isLoading } = useSWR<Profession>(
    isNew ? null : `/professions/${professionId}`,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await (isNew
        ? http.post("/professions", data)
        : http.patch(`/professions/${professionId}`, data));

      toast.success(
        isNew ? "Alan başarıyla oluşturuldu!" : "Alan başarıyla güncellendi!",
      );
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu alan profilini silmek istiyor musunuz?")) return;

    try {
      await http.delete(`/professions/${professionId}`);
      toast.success("Profesyonel başarıyla silindi!");
      navigate("/dashboard/professions");
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
            {isNew ? "Alan Oluştur" : `Alan: ${profession?.name} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={profession?.name}
              isRequired
              label="Adı"
              name="name"
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

export default ViewProfession;
