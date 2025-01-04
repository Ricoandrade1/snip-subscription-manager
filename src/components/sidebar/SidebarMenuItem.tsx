import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
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
  if (item.submenu) {
    return (
      <BaseSidebarMenuItem>
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
              {item.submenu.map((subItem: any) => (
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
                      {level === 1 && item.title === "Membros" &&
                        subItem.title !== "Todos" && getSubscriberCount && (
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
      </BaseSidebarMenuItem>
    );
  }

  return (
    <BaseSidebarMenuItem>
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
    </BaseSidebarMenuItem>
  );
}