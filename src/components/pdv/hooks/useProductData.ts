import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductListFilters } from "../types";
import { toast } from "sonner";

export function useProductData(filters: ProductListFilters) {
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

  return { products, isLoading, barbers };
}