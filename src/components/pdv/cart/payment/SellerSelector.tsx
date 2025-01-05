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

interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

interface SellerSelectorProps {
  sellers: Seller[];
  selectedSellers: Seller[];
  onSelectSeller: (seller: Seller) => void;
}

export function SellerSelector({ sellers, selectedSellers, onSelectSeller }: SellerSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Users className="mr-2 h-4 w-4" />
            {selectedSellers.length === 0
              ? "Selecionar Vendedor"
              : `${selectedSellers.length} vendedor(es)`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Vendedores</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sellers.map((seller) => (
            <DropdownMenuItem
              key={seller.id}
              onClick={() => onSelectSeller(seller)}
              className="flex items-center justify-between"
            >
              <span>{seller.name}</span>
              {selectedSellers.some((s) => s.id === seller.id) && (
                <span className="text-green-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}