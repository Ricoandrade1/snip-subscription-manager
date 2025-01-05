import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";

interface MenuItem {
  title: string;
  icon: any;
  url: string;
  submenu?: {
    title: string;
    url: string;
  }[];
}

interface NavigationMenuItemProps {
  item: MenuItem;
  isActiveRoute: (url: string) => boolean;
  getSubscriberCount?: (plan: "Basic" | "Classic" | "Business") => number;
}

export function NavigationMenuItem({
  item,
  isActiveRoute,
  getSubscriberCount,
}: NavigationMenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Automatically open submenu if current route is inside it
  useEffect(() => {
    if (item.submenu?.some(subItem => location.pathname === subItem.url)) {
      setIsOpen(true);
    }
  }, [location.pathname, item.submenu]);

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  if (item.submenu) {
    const hasActiveSubmenuItem = item.submenu.some(subItem => 
      location.pathname === subItem.url
    );

    return (
      <SidebarMenuItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.submenu.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <button 
                    onClick={() => handleNavigation(subItem.url)}
                    className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-muted ${
                      location.pathname === subItem.url ? 'bg-muted' : ''
                    }`}
                  >
                    <span>{subItem.title}</span>
                    {item.title === "Membros" &&
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
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <button
        onClick={() => handleNavigation(item.url)}
        className={`flex items-center gap-2 p-2 w-full rounded-md hover:bg-muted ${
          isActiveRoute(item.url) ? 'bg-muted' : ''
        }`}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </button>
    </SidebarMenuItem>
  );
}