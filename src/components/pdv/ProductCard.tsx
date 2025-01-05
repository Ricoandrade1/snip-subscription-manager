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
      {isNew && (
        <div className="absolute left-2 top-2 z-10">
          <div className="rounded-full bg-yellow-500/10 p-2 text-yellow-600">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      )}

      <div className="absolute right-2 top-2 z-10 flex gap-2">
        {onEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-500/10 p-2 text-gray-600 hover:bg-gray-500/20"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                Editar produto
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

      <div 
        className="aspect-square w-full overflow-hidden cursor-pointer"
        onClick={() => {
          if (product.stock > 0 || product.is_service) {
            onSelect(product);
          } else {
            toast.error("Produto sem estoque");
          }
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium leading-none truncate flex-1">{product.name}</h3>
          {isNew && (
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              Novo
            </span>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
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

        {hasCommissions && (
          <div className="text-xs text-muted-foreground pt-1">
            Comissões configuradas
          </div>
        )}
      </div>
    </Card>
  );
}