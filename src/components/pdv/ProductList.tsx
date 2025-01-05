import { Product, ProductListFilters } from "./types";
import { ProductListSkeleton } from "./components/ProductListSkeleton";
import { EmptyProductList } from "./components/EmptyProductList";
import { ProductListContent } from "./components/ProductListContent";
import { useProductData } from "./hooks/useProductData";

interface ProductListProps {
  onProductSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
  filters?: ProductListFilters;
  viewMode?: "list" | "grid";
}

export function ProductList({ 
  onProductSelect, 
  onEdit,
  filters = { 
    name: "", 
    category: "", 
    brand: "", 
    minPrice: "", 
    maxPrice: "", 
    inStock: false 
  },
  viewMode = "list"
}: ProductListProps) {
  const { products, isLoading, barbers } = useProductData(filters);

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (products.length === 0) {
    return <EmptyProductList />;
  }

  return (
    <ProductListContent
      products={products}
      barbers={barbers}
      onProductSelect={onProductSelect}
      onEdit={onEdit}
      viewMode={viewMode}
    />
  );
}