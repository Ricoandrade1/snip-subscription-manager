import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

interface SellerSelectorProps {
  selectedSellers: Seller[];
  onSelectSeller: (seller: Seller) => void;
}

export function SellerSelector({ selectedSellers, onSelectSeller }: SellerSelectorProps) {
  const [barbers, setBarbers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('id, name, commission_rate')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast.error("Erro ao carregar lista de barbeiros");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            <Users className="mr-2 h-4 w-4" />
            {isLoading ? "Carregando..." : 
              selectedSellers.length === 0
                ? "Selecionar Vendedor"
                : `${selectedSellers.length} vendedor(es)`
            }
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Vendedores</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {barbers.map((barber) => (
            <DropdownMenuItem
              key={barber.id}
              onClick={() => onSelectSeller(barber)}
              className="flex items-center justify-between"
            >
              <div>
                <span className="font-medium">{barber.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({barber.commission_rate}%)
                </span>
              </div>
              {selectedSellers.some((s) => s.id === barber.id) && (
                <span className="text-green-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
          {barbers.length === 0 && !isLoading && (
            <div className="p-2 text-sm text-muted-foreground text-center">
              Nenhum vendedor encontrado
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}