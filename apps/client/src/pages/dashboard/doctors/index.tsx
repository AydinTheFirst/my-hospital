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
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Doctor, Profession } from "@/types";

const ViewDoctors = () => {
  const navigate = useNavigate();

  const [filteredItems, setFilteredItems] = useState<Doctor[]>([]);
  const { data: doctors } = useSWR<Doctor[]>("/doctors");
  const { data: professions } = useSWR<Profession[]>("/professions");

  useEffect(() => {
    if (!doctors) return;
    setFilteredItems(doctors);
  }, [doctors]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!doctors) return;

    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(value),
    );

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

      case "name:asc":
        setFilteredItems(
          [...filteredItems].sort((a, b) => a.name.localeCompare(b.name)),
        );
        break;

      case "name:desc":
        setFilteredItems(
          [...filteredItems].sort((a, b) => b.name.localeCompare(a.name)),
        );
        break;

      default:
        break;
    }
  };

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/doctors/${key}`);
  };

  const columns = [
    { key: "name", label: "Adı" },
    { key: "profession", label: "Alan" },
    { key: "createdAt", label: "Oluşturulma Tarihi" },
  ];

  const rows = filteredItems.map((doctor) => {
    const profession = professions?.find(
      (profession) => profession.id === doctor.professionId,
    );

    return {
      createdAt: new Date(doctor.createdAt).toLocaleDateString(),
      key: doctor.id,
      name: doctor.name,
      profession: profession ? profession.name : "Bilinmiyor",
    };
  });

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Doktorlar</h2>
          <span className="text-sm text-gray-500">
            ({filteredItems.length}/{doctors?.length})
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

export default ViewDoctors;
