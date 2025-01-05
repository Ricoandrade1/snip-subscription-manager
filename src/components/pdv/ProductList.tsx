import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import { Product, ProductListFilters } from "./types";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Package, Scissors } from "lucide-react";

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

  useEffect(() => {
    fetchProducts();
    fetchBarbers();

    // Subscribe to ALL changes on the products table
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
          console.log('Real-time update received:', payload);
          fetchProducts(); // Refresh the list whenever any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Nenhum produto encontrado</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:bg-muted/50"
            onClick={() => onProductSelect(product)}
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