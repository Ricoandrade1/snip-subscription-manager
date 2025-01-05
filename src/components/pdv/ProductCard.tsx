import { Card } from "@/components/ui/card";
import { Product } from "./types";
import { Package, Scissors, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onEdit }: ProductCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // First check if the product has any sales
      const { data: saleItems, error: checkError } = await supabase
        .from('sale_items')
        .select('id')
        .eq('product_id', product.id)
        .limit(1);

      if (checkError) throw checkError;

      if (saleItems && saleItems.length > 0) {
        toast.error('Não é possível excluir um produto que já foi vendido');
        return;
      }

      // If no sales, proceed with deletion
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) throw deleteError;
      
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:bg-muted/50"
      onClick={(e) => {
        e.preventDefault();
        onSelect(product);
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              {product.is_service ? (
                <Scissors className="h-5 w-5 text-primary" />
              ) : (
                <Package className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-lg leading-none">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {product.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {product.brands?.name && (
                  <span className="bg-muted px-2 py-0.5 rounded-full">
                    {product.brands.name}
                  </span>
                )}
                {product.categories?.name && (
                  <span className="bg-muted px-2 py-0.5 rounded-full">
                    {product.categories.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
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

            <div className="flex gap-2">
              {onEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                      }}
                    >
                      Editar produto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}