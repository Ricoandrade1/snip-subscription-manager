import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import { Product, ProductListFilters } from "./types";
import { Separator } from "@/components/ui/separator";
import { ProductListSkeleton } from "./components/ProductListSkeleton";
import { EmptyProductList } from "./components/EmptyProductList";
import { ProductGrid } from "./components/ProductGrid";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barbers, setBarbers] = useState<{ id: string; name: string }[]>([]);

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, name");

      if (error) {
        console.error("Error fetching barbers:", error);
        return;
      }

      setBarbers(data || []);
    } catch (error) {
      console.error("Error in fetchBarbers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("products")
        .select("*, brands(name), categories(name)")
        .order('name');

      if (filters.name) {
        query = query.ilike("name", `%${filters.name}%`);
      }

      if (filters.category && filters.category !== "all") {
        query = query.eq("category_id", filters.category);
      }

      if (filters.brand && filters.brand !== "all") {
        query = query.eq("brand_id", filters.brand);
      }

      if (filters.minPrice) {
        query = query.gte("price", parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        query = query.lte("price", parseFloat(filters.maxPrice));
      }

      if (filters.inStock) {
        query = query.gt("stock", 0);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const formattedProducts: Product[] = (data || []).map(product => ({
        ...product,
        commission_rates: product.commission_rates ? 
          JSON.parse(JSON.stringify(product.commission_rates)) : 
          undefined
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBarbers();

    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Received payload:', payload);
          if (payload.eventType === 'DELETE') {
            setProducts(prevProducts => {
              console.log('Removing product:', payload.old.id);
              return prevProducts.filter(product => product.id !== payload.old.id);
            });
          } else {
            fetchProducts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (products.length === 0) {
    return <EmptyProductList />;
  }

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