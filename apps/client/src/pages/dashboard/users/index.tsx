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

import { User } from "@/types";

const ViewUsers = () => {
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { data: users } = useSWR<User[]>("/users");

  useEffect(() => {
    if (!users) return;
    setFilteredUsers(users);
  }, [users]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!users) return;

    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(value) ||
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.phoneNumber.toLowerCase().includes(value),
    );

    setFilteredUsers(filtered);
  };

  const handleSort = (type: string) => {
    switch (type) {
      case "date:asc":
        setFilteredUsers(
          [...filteredUsers].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );
        break;

      case "date:desc":
        setFilteredUsers(
          [...filteredUsers].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        break;

      case "email:asc":
        setFilteredUsers(
          [...filteredUsers].sort((a, b) => a.email.localeCompare(b.email)),
        );
        break;

      case "email:desc":
        setFilteredUsers(
          [...filteredUsers].sort((a, b) => b.email.localeCompare(a.email)),
        );
        break;

      case "name:asc":
        setFilteredUsers(
          [...filteredUsers].sort((a, b) =>
            a.firstName.localeCompare(b.firstName),
          ),
        );
        break;

      case "name:desc":
        setFilteredUsers(
          [...filteredUsers].sort((a, b) =>
            b.firstName.localeCompare(a.firstName),
          ),
        );
        break;

      default:
        break;
    }
  };

  const handleRowAction = (key: Key) => {
    navigate(`/dashboard/users/${key.toString()}`);
  };

  const columns = [
    {
      key: "name",
      label: "İsim",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phoneNumber",
      label: "Telefon",
    },
    {
      key: "roles",
      label: "Roller",
    },
    {
      key: "updatedAt",
      label: "Son Güncelleme",
    },
  ];

  const rows = filteredUsers.map((user) => {
    return {
      email: user.email,
      key: user.id,
      name: `${user.firstName}, ${user.lastName}`,
      phoneNumber: user.phoneNumber,
      roles: user.roles.join(", "),
      updatedAt: new Date(user.updatedAt).toLocaleDateString(),
    };
  });

  return (
    <section className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-end justify-start gap-3">
          <h2 className="text-2xl font-bold">Kullanıcılar</h2>
          <span className="text-sm text-gray-500">
            ({filteredUsers.length}/{users?.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Input
            className="max-w-xs"
            endContent={<LucideSearch />}
            label="Ara"
            onChange={handleFilter}
            placeholder="Kullanıcı ara..."
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

export default ViewUsers;
