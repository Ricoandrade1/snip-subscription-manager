import {
  LayoutDashboard,
  DollarSign,
  Package,
  Tags,
  Grid,
  Store,
  UserCog,
  Calendar,
  Scissors,
  Wallet,
  Users,
  FileBarChart2,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Assinantes",
    icon: Users,
    url: "/subscribers",
    submenu: [
      { title: "Todos", url: "/subscribers" },
      { title: "Basic", url: "/subscribers/basic" },
      { title: "Classic", url: "/subscribers/classic" },
      { title: "Business", url: "/subscribers/business" },
    ],
  },
  {
    title: "Utilizadores",
    icon: UserCog,
    url: "/users",
  },
  {
    title: "Barbeiros",
    icon: Scissors,
    url: "/barbers",
  },
  {
    title: "Caixa",
    icon: DollarSign,
    url: "/cash-flow",
  },
  {
    title: "Produtos",
    icon: Package,
    url: "/products",
  },
  {
    title: "Marcas",
    icon: Tags,
    url: "/brands",
  },
  {
    title: "Categorias",
    icon: Grid,
    url: "/categories",
  },
  {
    title: "Lojas",
    icon: Store,
    url: "/stores",
  },
  {
    title: "Relatórios",
    icon: FileBarChart2,
    url: "/reports",
  },
  {
    title: "Gestor de Conta",
    icon: Wallet,
    url: "/account",
  },
];