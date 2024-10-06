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

import { Note, User } from "@/types";

import professions from "../professions";

const ViewNotes = () => {
  const navigate = useNavigate();

  const [filteredItems, setFilteredItems] = useState<Note[]>([]);
  const { data: notes } = useSWR<Note[]>("/notes");
  const { data: users } = useSWR<User[]>("/users");

  useEffect(() => {
    if (!notes) return;
    setFilteredItems(notes);
  }, [notes]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!notes) return;

    const filtered = notes.filter((note) => {
      const user = users?.find((user) => user.id === note.userId);
      if (!user) return false;

      return (
        note.title.toLowerCase().includes(value) ||
        note.description.toLowerCase().includes(value) ||
        new Date(note.createdAt).toLocaleDateString().includes(value) ||
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

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/notes/${key}`);
  };

  const columns = [
    { key: "title", label: "Başlık" },
    { key: "description", label: "Açıklama" },
    { key: "createdAt", label: "Oluşturulma Tarihi" },
  ];

  const rows = filteredItems.map((note) => ({
    createdAt: new Date(note.createdAt).toLocaleDateString(),
    description: note.description,
    key: note.id,
    title: note.title,
  }));

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Notlar</h2>
          <span className="text-sm text-gray-500">
            ({filteredItems.length}/{professions?.length})
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

export default ViewNotes;
