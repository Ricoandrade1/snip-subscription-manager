import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useMemberContext } from "@/contexts/MemberContext";
import { menuItems } from "./sidebar/menuItems";
import { SidebarMenuItemComponent } from "./sidebar/SidebarMenuItem";
import { Button } from "./ui/button";

export function AppSidebar() {
  const location = useLocation();
  const { getMembersByPlan } = useMemberContext();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

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
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sidebar>
        <SidebarContent>
          <div className="flex items-center gap-2 px-2 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex">
              <Menu className="h-4 w-4" />
            </Button>
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
                  <SidebarMenuItemComponent
                    key={item.title}
                    item={item}
                    isActiveRoute={isActiveRoute}
                    openSubmenus={openSubmenus}
                    toggleSubmenu={toggleSubmenu}
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