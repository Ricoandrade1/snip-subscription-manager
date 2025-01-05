import { Link } from "react-router-dom";
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
  const handleTabChange = (value: string) => {
    switch (value) {
      case "Basic":
        window.location.href = "/members/basic";
        break;
      case "Classic":
        window.location.href = "/members/classic";
        break;
      case "Business":
        window.location.href = "/members/business";
        break;
      default:
        window.location.href = "/members";
        break;
    }
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
                  <SidebarMenuButton 
                    onClick={() => handleTabChange(subItem.title)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    data-active={isActiveRoute(subItem.url)}
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
                  </SidebarMenuButton>
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
      <SidebarMenuButton asChild>
        <Link 
          to={item.url} 
          className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-muted"
          data-active={isActiveRoute(item.url)}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
}