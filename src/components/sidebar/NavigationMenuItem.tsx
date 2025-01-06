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

  const isSubmenuActive = (submenuItem: { url: string; title: string }) => {
    if (item.title === "Assinantes") {
      if (submenuItem.title === "Todos") {
        return location.pathname === "/subscribers";
      }
      const planType = submenuItem.title.toLowerCase();
      return location.pathname === `/subscribers/${planType}`;
    }
    return location.pathname === submenuItem.url;
  };

  const hasActiveSubmenuItem = item.submenu?.some(isSubmenuActive);

  useEffect(() => {
    if (hasActiveSubmenuItem) {
      setIsOpen(true);
    }
  }, [hasActiveSubmenuItem]);

  const handleMainMenuClick = () => {
    if (item.submenu) {
      setIsOpen(!isOpen);
      if (item.title === "Assinantes") {
        navigate("/subscribers");
      }
    } else {
      navigate(item.url);
    }
  };

  if (item.submenu) {
    return (
      <SidebarMenuItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={handleMainMenuClick}>
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
                    onClick={() => navigate(subItem.url)}
                    className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-muted ${
                      isSubmenuActive(subItem) ? "bg-muted" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                    {item.title === "Assinantes" && subItem.title !== "Todos" && (
                      <span className="ml-auto text-xs opacity-60">
                        {getSubscriberCount?.(subItem.title as "Basic" | "Classic" | "Business")}
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
        onClick={() => navigate(item.url)}
        className={`flex items-center gap-2 p-2 w-full rounded-md hover:bg-muted ${
          isActiveRoute(item.url) ? "bg-muted" : ""
        }`}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </button>
    </SidebarMenuItem>
  );
}