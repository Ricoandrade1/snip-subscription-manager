import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Product } from "./types";
import { Scissors, Package, Sparkles, Percent, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onEdit }: ProductCardProps) {
  const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
  const hasCommissions = product.commission_rates && Object.keys(product.commission_rates).length > 0;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        product.stock === 0 ? 'opacity-50' : ''
      } ${isNew ? 'bg-[#FEF7CD]/30' : ''}`}
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted rounded-md">
              <Package className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-medium leading-none truncate">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {onEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-gray-500/10 p-2 text-gray-600 hover:bg-gray-500/20 active:bg-gray-500/30 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => onEdit(product)}
                      className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Editar produto</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {hasCommissions && (
                <div className="rounded-full bg-green-500/10 p-2 text-green-600" title="Tem comissões">
                  <Percent className="h-4 w-4" />
                </div>
              )}
              {product.is_service ? (
                <div className="rounded-full bg-purple-500/10 p-2 text-purple-500">
                  <Scissors className="h-4 w-4" />
                </div>
              ) : (
                <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
                  <Package className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(product.price)}
            </span>
            {!product.is_service && (
              <span className="text-sm text-muted-foreground">
                Estoque: {product.stock}
              </span>
            )}
          </div>

          <Button
            className="mt-4 w-full bg-barber-gold hover:bg-barber-gold/90 text-black"
            onClick={() => {
              if (product.stock > 0 || product.is_service) {
                onSelect(product);
              } else {
                toast.error("Produto sem estoque");
              }
            }}
          >
            Selecionar
          </Button>
        </div>
      </div>

      {isNew && (
        <div className="absolute left-2 top-2">
          <div className="rounded-full bg-yellow-500/10 p-2 text-yellow-600">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      )}
    </Card>
  );
}