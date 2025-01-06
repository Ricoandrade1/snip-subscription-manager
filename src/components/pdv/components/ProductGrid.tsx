import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Package, Scissors } from "lucide-react";
import { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  const handleClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    onProductSelect(product);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:bg-muted/50"
          onClick={(e) => handleClick(e, product)}
        >
          <div className="relative">
            <AspectRatio ratio={1}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  {product.is_service ? (
                    <Scissors className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
              )}
            </AspectRatio>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg leading-none mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price)}
              </p>
              {!product.is_service && (
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}