import {
  getKeyValue,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { LucideSearch } from "lucide-react";
import React, { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Appointment, Doctor, User } from "@/types";
import { localeDate } from "@/utils";

const ViewAppointments = () => {
  const navigate = useNavigate();

  const [filteredItems, setFilteredItems] = useState<Appointment[]>([]);
  const { data: appointments } = useSWR<Appointment[]>("/appointments");
  const { data: users } = useSWR<User[]>("/users");
  const { data: doctors } = useSWR<Doctor[]>("/doctors");

  useEffect(() => {
    if (!appointments) return;
    setFilteredItems(appointments);
  }, [appointments]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!appointments) return;

    const filtered = appointments.filter((appointment) => {
      const user = users?.find((user) => user.id === appointment.patientId);
      if (!user) return false;

      return (
        appointment.title.toLowerCase().includes(value) ||
        new Date(appointment.date).toLocaleDateString().includes(value) ||
        new Date(appointment.date).toLocaleTimeString().includes(value) ||
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value)
      );
    });

    setFilteredItems(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredItems(
          [...filteredItems].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );
        break;

      case "date:desc":
        setFilteredItems(
          [...filteredItems].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        break;

      case "title:asc":
        setFilteredItems(
          [...filteredItems].sort((a, b) => a.title.localeCompare(b.title)),
        );
        break;

      case "title:desc":
        setFilteredItems(
          [...filteredItems].sort((a, b) => b.title.localeCompare(a.title)),
        );
        break;

      default:
        break;
    }
  };

  const columns = [
    { key: "title", label: "Başlık" },
    { key: "date", label: "Tarih" },
    { key: "hour", label: "Saat" },
    { key: "doctor", label: "Doktor" },
    { key: "patient", label: "Hasta" },
  ];

  const rows = filteredItems.map((appointment) => {
    const user = users?.find((user) => user.id === appointment.patientId);
    const doctor = doctors?.find(
      (doctor) => doctor.id === appointment.doctorId,
    );

    return {
      date: localeDate(appointment.date),
      doctor: doctor ? doctor.name : "Bilinmiyor",
      hour: appointment.hour,
      key: appointment.id,
      patient: user ? `${user.firstName} ${user.lastName}` : "Bilinmiyor",
      title: appointment.title,
    };
  });

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/appointments/${key}`);
  };

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Randevular</h2>
          <span className="text-sm text-gray-500">
            ({filteredItems.length}/{appointments?.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Input
            className="max-w-xs"
            endContent={<LucideSearch />}
            label="Ara"
            onChange={handleFilter}
            placeholder="Ara..."
            variant="faded"
          />
          <Select
            className="max-w-xs"
            label="Sırala"
            onSelectionChange={(keys) =>
              handleSort(Array.from(keys)[0].toString())
            }
            placeholder="Sırala"
            variant="faded"
          >
            <SelectItem key="date:asc">Tarihe Göre (Eskiden Yeniye)</SelectItem>
            <SelectItem key="date:desc">
              Tarihe Göre (Yeniden Eskiye)
            </SelectItem>
            <SelectItem key="name:asc">İsme Göre (A-Z)</SelectItem>
            <SelectItem key="name:desc">İsme Göre (Z-A)</SelectItem>
            <SelectItem key="email:asc">E-Postaya Göre (A-Z)</SelectItem>
            <SelectItem key="email:desc">E-Postaya Göre (Z-A)</SelectItem>
          </Select>
        </div>
      </div>

      <Table
        aria-label="Example table with dynamic content"
        isStriped
        onRowAction={handleRowAction}
        selectionMode="single"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default ViewAppointments;
