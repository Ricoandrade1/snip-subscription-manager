import {
  LayoutDashboard,
  DollarSign,
  Users,
  Package,
  Building,
  Tags,
  Grid,
  Store,
  UserCog,
  Calendar,
  Scissors,
  Wallet,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Barbeiros",
    icon: Scissors,
    url: "/barbers",
  },
  {
    title: "Movimentos de Caixa",
    icon: DollarSign,
    url: "/cash-flow",
  },
  {
    title: "Produtos",
    icon: Package,
    url: "/products",
  },
  {
    title: "Clientes",
    icon: Users,
    url: "/members",
    submenu: [
      { title: "Todos", url: "/members" },
      { title: "Basic", url: "/members/basic" },
      { title: "Classic", url: "/members/classic" },
      { title: "Business", url: "/members/business" },
    ],
  },
  {
    title: "Fornecedores",
    icon: Building,
    url: "/suppliers",
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
    title: "Utilizadores",
    icon: UserCog,
    url: "/users",
  },
  {
    title: "Gestor de Conta",
    icon: Wallet,
    url: "/account",
  },
];