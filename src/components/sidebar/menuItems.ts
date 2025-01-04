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
} from "lucide-react";

export const menuItems = [
  {
    title: "Membros",
    icon: Users,
    url: "/members",
    submenu: [
      { title: "Todos", url: "/members/all" },
      { title: "Basic", url: "/members/basic" },
      { title: "Classic", url: "/members/classic" },
      { title: "Business", url: "/members/business" },
    ],
  },
  {
    title: "Social Media",
    icon: Rss,
    url: "/social",
    submenu: [
      { title: "Story", url: "/social/story", icon: Image },
      { title: "Feed", url: "/social/feed", icon: Rss },
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