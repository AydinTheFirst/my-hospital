import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import http from "@/http";
import { Appointment, Doctor, Profession } from "@/types";
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

  const handleCancel = async () => {
    if (!confirm("Randevuyu iptal etmek istediğinize emin misiniz?")) return;

    try {
      await http.patch(`/appointments/${appointment.id}`, {
        ...appointment,
        status: "CANCELLED" as Appointment["status"],
      });
      toast.success("Randevu başarıyla iptal edildi!");
      mutate("/appointments");
    } catch (error) {
      http.handleError(error);
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
      <CardFooter>
        <Button color="danger" onClick={handleCancel}>
          İptal Et
        </Button>
      </CardFooter>
    </Card>
  );
};
