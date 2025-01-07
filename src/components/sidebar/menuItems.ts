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
    description: "Visão geral do sistema com métricas e estatísticas importantes",
  },
  {
    title: "Assinantes",
    icon: Users,
    url: "/subscribers",
    description: "Gerenciamento completo dos assinantes da barbearia",
    submenu: [
      { 
        title: "Todos", 
        url: "/subscribers",
        description: "Lista completa de todos os assinantes" 
      },
      { 
        title: "Basic", 
        url: "/subscribers/basic",
        description: "Assinantes do plano Basic - Serviços básicos de barbearia" 
      },
      { 
        title: "Classic", 
        url: "/subscribers/classic",
        description: "Assinantes do plano Classic - Serviços premium de barbearia" 
      },
      { 
        title: "Business", 
        url: "/subscribers/business",
        description: "Assinantes do plano Business - Serviços VIP e exclusivos" 
      },
    ],
  },
  {
    title: "Utilizadores",
    icon: UserCog,
    url: "/users",
    description: "Gestão de usuários e suas permissões no sistema",
  },
  {
    title: "Barbeiros",
    icon: Scissors,
    url: "/barbers",
    description: "Gerenciamento da equipe de barbeiros",
  },
  {
    title: "Caixa",
    icon: DollarSign,
    url: "/cash-flow",
    description: "Controle de entradas e saídas financeiras",
  },
  {
    title: "Produtos",
    icon: Package,
    url: "/products",
    description: "Gestão do estoque e catálogo de produtos",
  },
  {
    title: "Marcas",
    icon: Tags,
    url: "/brands",
    description: "Gerenciamento das marcas de produtos",
  },
  {
    title: "Categorias",
    icon: Grid,
    url: "/categories",
    description: "Organização e gestão das categorias de produtos",
  },
  {
    title: "Lojas",
    icon: Store,
    url: "/stores",
    description: "Administração das unidades da barbearia",
  },
  {
    title: "Relatórios",
    icon: FileBarChart2,
    url: "/reports",
    description: "Relatórios e análises detalhadas do negócio",
  },
  {
    title: "Gestor de Conta",
    icon: Wallet,
    url: "/account",
    description: "Configurações e preferências da sua conta",
  },
];