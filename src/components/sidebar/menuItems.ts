import {
  LayoutDashboard,
  DollarSign,
  Users,
  Package,
  ArrowUpDown,
  Building,
  Tags,
  Grid,
  Store,
  UserCog,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  Wallet,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
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
    title: "Variações",
    icon: ArrowUpDown,
    url: "/variations",
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
    title: "Relatórios",
    icon: Calendar,
    url: "/reports",
    submenu: [
      { title: "Diário", url: "/reports/daily" },
      { title: "Por Hora", url: "/reports/hourly" },
      { title: "Dias da Semana", url: "/reports/weekly" },
      { title: "Mensal", url: "/reports/monthly" },
    ],
  },
  {
    title: "Gestor de Conta",
    icon: Wallet,
    url: "/account",
  },
];