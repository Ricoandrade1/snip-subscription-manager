import { Card } from "@/components/ui/card";
import { Product } from "./types";
import { ProductIcon } from "./components/ProductIcon";
import { ProductInfo } from "./components/ProductInfo";
import { ProductPrice } from "./components/ProductPrice";
import { ProductActions } from "./components/ProductActions";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export function ProductCard({ product, barbers, onSelect, onEdit }: ProductCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(product);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:bg-muted/50"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProductIcon isService={!!product.is_service} />
            <ProductInfo
              name={product.name}
              description={product.description}
              brandName={product.brands?.name}
              categoryName={product.categories?.name}
            />
          </div>

          <div className="flex items-center gap-4">
            <ProductPrice
              price={product.price}
              stock={product.stock}
              isService={product.is_service}
            />
            <ProductActions product={product} onEdit={onEdit} />
          </div>
        </div>
      </div>
    </Card>
  );
}