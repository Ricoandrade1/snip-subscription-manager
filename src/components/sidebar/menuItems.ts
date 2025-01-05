import {
  Users,
  BarChart3,
  Calendar,
  Truck,
  Package,
  Scissors,
  Building,
  Image,
  Rss,
  Home,
  LayoutDashboard,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Home",
    icon: Home,
    url: "/home",
  },
  {
    title: "Membros",
    icon: Users,
    url: "/members",
    submenu: [
      { title: "Todos", url: "/members" },
      { title: "Basic", url: "/members" },
      { title: "Classic", url: "/members" },
      { title: "Business", url: "/members" },
    ],
  },
  {
    title: "Social Media",
    icon: Rss,
    url: "/social",
    submenu: [
      { title: "Story", url: "/story", icon: Image },
      { title: "Feed", url: "/feed", icon: Rss },
    ],
  },
  {
    title: "Receita",
    icon: BarChart3,
    url: "/revenue",
  },
  {
    title: "Agenda",
    icon: Calendar,
    url: "/schedule",
  },
  {
    title: "Fornecedores",
    icon: Truck,
    url: "/suppliers",
    submenu: [
      { title: "Registrar", url: "/suppliers/register" },
      { title: "Receber", url: "/suppliers/receive" },
      { title: "Pagar", url: "/suppliers/pay" },
    ],
  },
  {
    title: "Produtos",
    icon: Package,
    url: "/products",
  },
  {
    title: "Barbeiros",
    icon: Scissors,
    url: "/barbers",
  },
  {
    title: "Barbearia",
    icon: Building,
    url: "/locations",
  },
];
