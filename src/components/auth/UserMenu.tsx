import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const UserMenu = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.user_metadata?.role === 'admin');
    };
    
    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-barber-gold">
          <User className="h-4 w-4 text-barber-gold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-barber-black border-barber-gray">
        {isAdmin && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2 text-barber-gold">
              <Shield className="h-4 w-4" />
              Administrador
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-barber-gray/50" />
          </>
        )}
        <DropdownMenuItem
          className="text-barber-light hover:bg-barber-gray/50 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};