import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import { Product, ProductListFilters } from "./types";

interface ProductListProps {
  onProductSelect: (product: Product) => void;
  filters?: ProductListFilters;
}

export function ProductList({ 
  onProductSelect, 
  filters = { 
    name: "", 
    category: "", 
    brand: "", 
    minPrice: "", 
    maxPrice: "", 
    inStock: false 
  } 
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barbers, setBarbers] = useState<{ id: string; name: string }[]>([]);

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
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const fetchBarbers = async () => {
    const { data, error } = await supabase
      .from("barbers")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching barbers:", error);
      return;
    }

    setBarbers(data || []);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("products")
        .select("*, brands(name), categories(name)")
        .order("name");

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
          JSON.parse(JSON.stringify(product.commission_rates)) as Record<string, number> : 
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

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {isLoading ? (
            <div className="w-full text-center">Carregando produtos...</div>
          ) : products.length === 0 ? (
            <div className="w-full text-center">Nenhum produto encontrado</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="w-[300px]">
                <ProductCard
                  product={product}
                  barbers={barbers}
                  onSelect={onProductSelect}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}