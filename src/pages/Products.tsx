import { useState, useEffect } from "react";
import { ProductList } from "@/components/pdv/ProductList";
import { ProductFilter } from "@/components/products/ProductFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductServiceForm } from "@/components/pdv/ProductServiceForm";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Product } from "@/components/pdv/types";

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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
          <h1 className="text-2xl font-bold">Produtos</h1>
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <ProductServiceForm
                initialData={selectedProduct}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setSelectedProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ProductFilter filters={filters} onFilterChange={setFilters} />
        
        <ProductList 
          filters={filters} 
          onProductSelect={handleViewDetails} 
          onEdit={handleEdit}
        />

        {/* Product Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Produto</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}