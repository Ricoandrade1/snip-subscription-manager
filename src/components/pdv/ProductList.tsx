import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  brand_id: string | null;
  category_id: string | null;
  brands?: {
    name: string;
  };
  categories?: {
    name: string;
  };
  commission_rates?: Record<string, number>;
}

interface ProductListProps {
  onProductSelect: (product: Product) => void;
  filters?: {
    name: string;
    category: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    inStock: boolean;
  };
}

export function ProductList({ onProductSelect, filters = { name: "", category: "", brand: "", minPrice: "", maxPrice: "", inStock: false } }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

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

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center">Carregando produtos...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center">Nenhum produto encontrado</div>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                product.stock === 0 ? 'opacity-50' : ''
              }`}
              onClick={() => {
                if (product.stock > 0) {
                  onProductSelect(product);
                } else {
                  toast.error("Produto sem estoque");
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-2xl font-bold text-barber-gold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(product.price)}
                  </div>
                  <div className={`text-xs ${
                    product.stock === 0 ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    Estoque: {product.stock}
                  </div>
                  {product.brands && (
                    <div className="text-xs text-muted-foreground">
                      Marca: {product.brands.name}
                    </div>
                  )}
                  {product.categories && (
                    <div className="text-xs text-muted-foreground">
                      Categoria: {product.categories.name}
                    </div>
                  )}
                </div>
                {product.commission_rates && Object.keys(product.commission_rates).length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium">Comissões:</div>
                    {Object.entries(product.commission_rates).map(([barberId, rate]) => (
                      <div key={barberId}>{rate}%</div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}