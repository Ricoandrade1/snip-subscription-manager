import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductServiceForm } from "./ProductServiceForm";
import { toast } from "sonner";
import { Product } from "./types";

export function ProductServiceGrid() {
  const [items, setItems] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, brands(name), categories(name)')
        .order('name');

      if (error) {
        console.error("Error fetching items:", error);
        toast.error("Erro ao carregar itens");
        return;
      }

      setItems(data || []);
    } catch (error) {
      console.error("Error in fetchItems:", error);
      toast.error("Erro ao carregar itens");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting item:", error);
        toast.error("Erro ao deletar item");
        return;
      }

      toast.success("Item deletado com sucesso");
      fetchItems();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Erro ao deletar item");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produtos e Serviços</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Editar Item" : "Novo Item"}
              </DialogTitle>
            </DialogHeader>
            <ProductServiceForm
              initialData={selectedItem}
              onSuccess={() => {
                setIsDialogOpen(false);
                fetchItems();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4 relative group">
            <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedItem(item);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            ) : (
              <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                Sem imagem
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-medium truncate">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {item.brands?.name && (
                  <span className="text-sm text-muted-foreground">
                    Marca: {item.brands.name}
                  </span>
                )}
                {item.categories?.name && (
                  <span className="text-sm text-muted-foreground">
                    Categoria: {item.categories.name}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold">
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.price)}
                </span>
                {!item.is_service && (
                  <span className="text-sm text-muted-foreground">
                    Estoque: {item.stock}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}