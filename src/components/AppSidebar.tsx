import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMemberContext } from "@/contexts/MemberContext";
import { menuItems } from "./sidebar/menuItems";
import { NavigationMenuItem } from "./sidebar/NavigationMenuItem";
import { Button } from "./ui/button";

export function AppSidebar() {
  const location = useLocation();
  const { getMembersByPlan } = useMemberContext();
  const { toggleSidebar } = useSidebar();

  const isActiveRoute = (url: string) => {
    // Verifica se é a rota de membros ou suas subrotas
    if (url === '/members') {
      return location.pathname.startsWith('/members');
    }
    return location.pathname === url;
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sidebar>
        <SidebarContent>
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="font-semibold text-barber-gold">Barbearia</span>
            <div className="ml-auto">
              <SidebarTrigger />
            </div>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <NavigationMenuItem
                    key={item.title}
                    item={item}
                    isActiveRoute={isActiveRoute}
                    getSubscriberCount={getMembersByPlan}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}