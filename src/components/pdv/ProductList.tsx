import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductListProps {
  onProductSelect: (product: Product) => void;
}

export function ProductList({ onProductSelect }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

    // Inscrever-se para atualizações em tempo real
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
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center">Carregando produtos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center">Nenhum produto encontrado</div>
        ) : (
          filteredProducts.map((product) => (
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
            </Card>
          ))
        )}
      </div>
    </div>
  );
}