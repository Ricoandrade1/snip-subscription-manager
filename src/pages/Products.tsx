import { useState } from "react";
import { ProductList } from "@/components/pdv/ProductList";
import { ProductFilter } from "@/components/products/ProductFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductServiceForm } from "@/components/pdv/ProductServiceForm";
import { Plus } from "lucide-react";

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  return (
    <div className="h-full w-full p-4">
      <div className="mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
              </DialogHeader>
              <ProductServiceForm
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ProductFilter filters={filters} onFilterChange={setFilters} />
        <ProductList filters={filters} onProductSelect={() => {}} />
      </div>
    </div>
  );
}