import {
  Users,
  BarChart3,
  Calendar,
  Truck,
  Package,
  Scissors,
  Building,
  Home,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useMemberContext } from "@/contexts/MemberContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";

const menuItems = [
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
      { title: "Todos", url: "/members/all" },
      { title: "Basic", url: "/members/basic" },
      { title: "Classic", url: "/members/classic" },
      { title: "Business", url: "/members/business" },
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

export function AppSidebar() {
  const location = useLocation();
  const { getMembersByPlan } = useMemberContext();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  // Atualiza o estado inicial dos submenus baseado na rota atual
  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find(item => 
      item.submenu?.some(subItem => currentPath.startsWith(subItem.url)) || 
      currentPath === item.url
    );
    
    if (activeMenuItem && !openSubmenus.includes(activeMenuItem.title)) {
      setOpenSubmenus(prev => [...prev, activeMenuItem.title]);
    }
  }, [location.pathname]);

  const getSubscriberCount = (plan: "Basic" | "Classic" | "Business") => {
    return getMembersByPlan(plan).length;
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActiveRoute = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="font-semibold text-barber-gold">Barbearia</span>
          <SidebarTrigger />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible
                      open={openSubmenus.includes(item.title)}
                      onOpenChange={() => toggleSubmenu(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <div className="flex w-full items-center justify-between">
                            <Link 
                              to={item.url} 
                              className="flex items-center gap-2"
                              data-active={isActiveRoute(item.url)}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                openSubmenus.includes(item.title) ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                data-active={isActiveRoute(subItem.url)}
                              >
                                <Link 
                                  to={subItem.url}
                                  className="w-full"
                                >
                                  {subItem.title}
                                  {item.title === "Membros" &&
                                    subItem.title !== "Todos" && (
                                      <span className="ml-auto text-xs opacity-60">
                                        {getSubscriberCount(
                                          subItem.title as "Basic" | "Classic" | "Business"
                                        )}
                                      </span>
                                    )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      data-active={isActiveRoute(item.url)}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}