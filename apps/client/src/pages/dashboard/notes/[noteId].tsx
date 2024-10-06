import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { AxiosProgressEvent } from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import http from "@/http";
import { Appointment, Note, User } from "@/types";
import { getFileUrl } from "@/utils";

const ViewNote = () => {
  const navigate = useNavigate();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  const { noteId } = useParams<{ noteId: string }>();
  const isNew = noteId === "new";

  const { data: note, isLoading } = useSWR<Note>(
    isNew ? null : `/notes/${noteId}`,
  );
  const { data: appointments } = useSWR<Appointment[]>("/appointments");
  const { data: users } = useSWR<User[]>("/users");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      const { data: note } = isNew
        ? await http.post<Note>("/notes", data)
        : await http.patch<Note>(`/notes/${noteId}`, data);

      toast.success(
        isNew ? "Not başarıyla oluşturuldu!" : "Not başarıyla güncellendi!",
      );

      if (!isNew) return navigate("/dashboard/notes");

      const filesForm = new FormData();
      filesForm.append("noteId", noteId);
      filesForm.append("files", data.files as File);

      await http.post(`/notes/${note.id}/files`, filesForm);

      toast.success("Dosyalar başarıyla yüklendi!");

      navigate("/dashboard/notes");
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu notu silmek istiyor musunuz?")) return;

    try {
      await http.delete(`/notes/${noteId}`);
      toast.success("Not başarıyla silindi!");
      navigate("/dashboard/notes");
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
            {isNew ? "Not Oluştur" : `Not: ${note?.title} güncelle`}
          </h3>
        </CardHeader>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              defaultValue={note?.title}
              isRequired
              label="Başlık"
              name="title"
            />

            <Input
              className="col-span-12"
              defaultValue={note?.type}
              isRequired
              label="Tip"
              name="type"
            />

            <Select
              className="col-span-12"
              isRequired
              label="Randevu"
              name="appointmentId"
            >
              {appointments ? (
                appointments.map((appointment) => (
                  <SelectItem
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    textValue={appointment.title}
                    value={appointment.id}
                  >
                    {appointment.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="" value="">
                  Yükleniyor...
                </SelectItem>
              )}
            </Select>

            <Select
              className="col-span-12"
              isRequired
              label="Hasta"
              name="userId"
              selectedKeys={[
                selectedAppointment ? selectedAppointment.patientId : "",
              ]}
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
                <SelectItem key="" value="">
                  Yükleniyor...
                </SelectItem>
              )}
            </Select>

            <Textarea
              className="col-span-12"
              defaultValue={note?.description}
              isRequired
              label="Açıklama"
              name="description"
            />

            {isNew && (
              <Input
                className="col-span-12"
                isRequired
                label="Files"
                multiple
                name="files"
                type="file"
              />
            )}

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

      {!isNew && <ViewFiles note={note!} />}
    </section>
  );
};

export default ViewNote;

const ViewFiles = ({ note }: { note: Note }) => {
  const [uploadProgress, setUploadProgress] = useState<AxiosProgressEvent>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      await http.post(`/notes/${note.id}/files`, formData, {
        onUploadProgress: setUploadProgress,
      });
      toast.success("Dosyalar başarıyla yüklendi!");
      mutate(`/notes/${note.id}`);
    } catch (error) {
      http.handleError(error);
    }

    setUploadProgress(undefined);
  };

  if (uploadProgress) {
    const { loaded, total } = uploadProgress;
    const percent = Math.round((loaded / total!) * 100);

    const loadedMB = (loaded / 1024 / 1024).toFixed(2);
    const totalMB = (total! / 1024 / 1024).toFixed(2);

    return (
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">Dosyalar</h3>
        </CardHeader>
        <CardBody>
          <Progress
            color="primary"
            label={`${loadedMB} / ${totalMB} (${percent}%)`}
            value={percent}
          />
        </CardBody>
      </Card>
    );
  }

  const handleDelete = async (file: string) => {
    try {
      await http.delete(`/notes/${note.id}/files/${file}`);
      toast.success("Dosya başarıyla silindi!");
      mutate(`/notes/${note.id}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  const handleView = (file: string) => {
    window.open(getFileUrl(file), "_blank");
  };

  return (
    <section className="grid gap-5">
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">Dosyalar</h3>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3">
            {note.files ? (
              note.files.map((file, i) => (
                <div className="flex justify-between" key={file}>
                  <div className="flex gap-1">
                    <p>{i + 1}.</p>
                    <p>{file}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button color="primary" onClick={() => handleView(file)}>
                      Görüntüle
                    </Button>
                    <Button color="danger" onClick={() => handleDelete(file)}>
                      Sil
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>Yükleniyor...</p>
            )}
          </div>
        </CardBody>
        <CardBody>
          <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
            <Input
              className="col-span-12"
              isRequired
              label="Files"
              multiple
              name="files"
              type="file"
            />

            <Button
              className="col-span-12"
              color="primary"
              fullWidth
              type="submit"
            >
              Yükle
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
};
