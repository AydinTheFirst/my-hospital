import { Calendar, Home, Notebook, Users, Users2 } from "lucide-react";

export const sidebarItems = [
  {
    canCreate: false,
    href: "/dashboard",
    icon: Home,
    label: "Yönetim Paneli",
  },
  {
    canCreate: true,
    href: "/dashboard/users",
    icon: Users,
    label: "Kullanıcılar",
  },
  {
    canCreate: true,
    href: "/dashboard/appointments",
    icon: Calendar,
    label: "Randevular",
  },
  {
    canCreate: true,
    href: "/dashboard/notes",
    icon: Notebook,
    label: "Notlar",
  },
  {
    canCreate: true,
    href: "/dashboard/doctors",
    icon: Users2,
    label: "Doktorlar",
  },
  {
    canCreate: true,
    href: "/dashboard/professions",
    icon: Users2,
    label: "Alanlar",
  },
];
