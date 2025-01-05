import { Product } from "../types";
import { ProductCard } from "../ProductCard";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "./ProductGrid";

interface ProductListContentProps {
  products: Product[];
  barbers: { id: string; name: string }[];
  onProductSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
  viewMode?: "list" | "grid";
}

export function ProductListContent({
  products,
  barbers,
  onProductSelect,
  onEdit,
  viewMode = "list"
}: ProductListContentProps) {
  if (viewMode === "grid") {
    return (
      <ProductGrid 
        products={products}
        onProductSelect={onProductSelect}
      />
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <div key={product.id}>
          <ProductCard
            product={product}
            barbers={barbers}
            onSelect={onProductSelect}
            onEdit={onEdit}
          />
          {index < products.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  );
}