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
} from "lucide-react";

export const menuItems = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "Membros",
    icon: Users,
    url: "/members",
    submenu: [
      { title: "Todos", url: "/members", count: 9 },
      { title: "Basic", url: "/members?plan=basic", count: 3 },
      { title: "Classic", url: "/members?plan=classic", count: 3 },
      { title: "Business", url: "/members?plan=business", count: 3 },
    ],
  },
  {
    title: "Social Media",
    icon: Rss,
    url: "/social",
    submenu: [
      { title: "Story", url: "/story" },
      { title: "Feed", url: "/feed" },
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