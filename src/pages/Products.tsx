import { useState, useEffect } from "react";
import { ProductList } from "@/components/pdv/ProductList";
import { ProductFilter } from "@/components/products/ProductFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductServiceForm } from "@/components/pdv/ProductServiceForm";
import { Grid, List, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Product } from "@/components/pdv/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container py-2">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Produtos</h1>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "list" | "grid")}>
              <ToggleGroupItem value="list" aria-label="Lista">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grade">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedProduct(null);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[80vh]">
                <div className="p-1">
                  <ProductServiceForm
                    initialData={selectedProduct}
                    onSuccess={() => {
                      setIsDialogOpen(false);
                      setSelectedProduct(null);
                    }}
                  />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <ProductFilter filters={filters} onFilterChange={setFilters} />
        
        <ProductList 
          filters={filters} 
          onProductSelect={handleViewDetails} 
          onEdit={handleEdit}
          viewMode={viewMode}
        />

        {/* Product Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Produto</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              {selectedProduct && (
                <div className="space-y-4 p-1">
                  <div className="grid gap-2">
                    <div>
                      <h3 className="font-medium">Nome</h3>
                      <p>{selectedProduct.name}</p>
                    </div>
                    {selectedProduct.description && (
                      <div>
                        <h3 className="font-medium">Descrição</h3>
                        <p>{selectedProduct.description}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">Preço</h3>
                      <p>
                        {new Intl.NumberFormat("pt-PT", {
                          style: "currency",
                          currency: "EUR",
                        }).format(selectedProduct.price)}
                      </p>
                    </div>
                    {!selectedProduct.is_service && (
                      <div>
                        <h3 className="font-medium">Estoque</h3>
                        <p>{selectedProduct.stock}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">Tipo</h3>
                      <p>{selectedProduct.is_service ? "Serviço" : "Produto"}</p>
                    </div>
                    {selectedProduct.brands && (
                      <div>
                        <h3 className="font-medium">Marca</h3>
                        <p>{selectedProduct.brands.name}</p>
                      </div>
                    )}
                    {selectedProduct.categories && (
                      <div>
                        <h3 className="font-medium">Categoria</h3>
                        <p>{selectedProduct.categories.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                      Fechar
                    </Button>
                    <Button onClick={() => {
                      setIsDetailsOpen(false);
                      handleEdit(selectedProduct);
                    }}>
                      Editar
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}