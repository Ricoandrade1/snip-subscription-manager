import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductServiceForm } from "./ProductServiceForm";
import { toast } from "sonner";
import { Product } from "./types";
import { ProductCard } from "./ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProductServiceGrid() {
  const [items, setItems] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();

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

      const formattedProducts: Product[] = (data || []).map(product => ({
        ...product,
        commission_rates: product.commission_rates ? 
          JSON.parse(JSON.stringify(product.commission_rates)) as Record<string, number> : 
          undefined
      }));

      setItems(formattedProducts);
    } catch (error) {
      console.error("Error in fetchItems:", error);
      toast.error("Erro ao carregar itens");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedItem(product);
    setIsDialogOpen(true);
  };

  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
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
              <ScrollArea className="max-h-[80vh]">
                <div className="p-1">
                  <ProductServiceForm
                    initialData={selectedItem}
                    onSuccess={() => {
                      setIsDialogOpen(false);
                      setSelectedItem(null);
                      fetchItems();
                    }}
                  />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              barbers={[]}
              onSelect={() => {}}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}