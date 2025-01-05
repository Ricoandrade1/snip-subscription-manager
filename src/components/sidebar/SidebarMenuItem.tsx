import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MenuItemProps {
  item: any;
  isActiveRoute: (url: string) => boolean;
  openSubmenus: string[];
  toggleSubmenu: (title: string) => void;
  getSubscriberCount?: (plan: "Basic" | "Classic" | "Business") => number;
  level?: number;
}

export function SidebarMenuItemComponent({
  item,
  isActiveRoute,
  openSubmenus,
  toggleSubmenu,
  getSubscriberCount,
  level = 0,
}: MenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (url: string) => {
    navigate(url);
  };

  const isSubmenuItemActive = (url: string) => {
    if (url === "/members") {
      return location.pathname === "/members";
    }
    return location.pathname === url;
  };

  if (item.submenu) {
    return (
      <BaseSidebarMenuItem>
        <Collapsible
          open={openSubmenus.includes(item.title)}
          onOpenChange={() => toggleSubmenu(item.title)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
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
              {item.submenu.map((subItem: any) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <button 
                    onClick={() => handleTabChange(subItem.url)}
                    className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-muted ${
                      isSubmenuItemActive(subItem.url) ? 'bg-muted' : ''
                    }`}
                  >
                    <span>{subItem.title}</span>
                    {level === 0 && item.title === "Membros" &&
                      subItem.title !== "Todos" && getSubscriberCount && (
                        <span className="ml-auto text-xs opacity-60">
                          {getSubscriberCount(
                            subItem.title as "Basic" | "Classic" | "Business"
                          )}
                        </span>
                      )}
                  </button>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </BaseSidebarMenuItem>
    );
  }

  return (
    <BaseSidebarMenuItem>
      <button
        onClick={() => handleTabChange(item.url)}
        className={`flex items-center gap-2 p-2 w-full rounded-md hover:bg-muted ${
          isActiveRoute(item.url) ? 'bg-muted' : ''
        }`}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </button>
    </BaseSidebarMenuItem>
  );
}