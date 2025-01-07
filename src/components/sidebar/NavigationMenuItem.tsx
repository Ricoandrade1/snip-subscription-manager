import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";

interface MenuItem {
  title: string;
  icon: any;
  url: string;
  description?: string;
  submenu?: {
    title: string;
    url: string;
    description?: string;
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
  const [dialogOpen, setDialogOpen] = useState(false);

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
  }, [hasActiveSubmenuItem, location.pathname]);

  const handleMainMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDialogOpen(true);
    if (item.submenu) {
      setIsOpen(!isOpen);
    }
  };

  const handleNavigate = (url: string) => {
    setDialogOpen(false);
    navigate(url);
  };

  const renderDialogContent = () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {item.description || `Informações sobre ${item.title}`}
        </p>
        {item.submenu ? (
          <div className="grid gap-4">
            {item.submenu.map((subItem) => (
              <div
                key={subItem.title}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handleNavigate(subItem.url)}
              >
                <h4 className="font-medium mb-2">{subItem.title}</h4>
                {item.title === "Assinantes" && subItem.title !== "Todos" && (
                  <span className="text-sm text-muted-foreground">
                    Total: {getSubscriberCount?.(subItem.title as "Basic" | "Classic" | "Business")}
                  </span>
                )}
                {subItem.description && (
                  <p className="text-sm text-muted-foreground">{subItem.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={() => handleNavigate(item.url)}
            className="w-full p-4 border rounded-lg hover:bg-accent text-left"
          >
            <h4 className="font-medium">Acessar {item.title}</h4>
          </button>
        )}
      </div>
    );
  };

  if (item.submenu) {
    return (
      <>
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
                      onClick={() => handleNavigate(subItem.url)}
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{item.title}</DialogTitle>
            </DialogHeader>
            {renderDialogContent()}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <SidebarMenuItem>
        <button
          onClick={handleMainMenuClick}
          className={`flex items-center gap-2 p-2 w-full rounded-md hover:bg-muted ${
            isActiveRoute(item.url) ? "bg-muted" : ""
          }`}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </button>
      </SidebarMenuItem>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}