import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Product } from "./types";
import { Scissors, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
        product.stock === 0 ? 'opacity-50' : ''
      }`}
      onClick={() => {
        if (product.stock > 0 || product.is_service) {
          onSelect(product);
        } else {
          toast.error("Produto sem estoque");
        }
      }}
    >
      <div className="absolute right-2 top-2 z-10">
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

      <div className="aspect-square w-full overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <h3 className="font-medium leading-none truncate">{product.name}</h3>
        <div className="flex items-center justify-between">
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
      </div>
    </Card>
  );
}