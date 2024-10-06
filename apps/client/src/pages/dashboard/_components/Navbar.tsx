import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { UserIcon } from "lucide-react";
import useSWR from "swr";

import { ThemeToggler } from "@/components";
import { User } from "@/types";

import { SidebarToggler } from "./SidebarToggler";

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <Card className="p-3" radius="none">
      <div className="flex justify-between gap-3">
        <SidebarToggler toggleSidebar={toggleSidebar} />
        <div className="flex items-center gap-3">
          <ThemeToggler />
          <UserDisplay />
        </div>
      </div>
    </Card>
  );
};

const UserDisplay = () => {
  const { data: me } = useSWR<User>("/auth/me", {
    onError: () => {},
  });

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  if (!me) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button startContent={<UserIcon />} variant="faded">
          <strong className="mt-1">{me.firstName}</strong>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem color="danger" onPress={logout}>
          Çıkış Yap
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
