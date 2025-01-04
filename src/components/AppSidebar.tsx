import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  );
}