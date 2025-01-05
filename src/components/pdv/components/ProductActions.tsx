import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "../types";

interface ProductActionsProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export function ProductActions({ product, onEdit }: ProductActionsProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event propagation
    
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      // Verificar vendas associadas
      const { data: saleItems, error: checkError } = await supabase
        .from('sale_items')
        .select('id')
        .eq('product_id', product.id)
        .limit(1);

      if (checkError) {
        console.error('Erro ao verificar vendas:', checkError);
        toast.error('Erro ao verificar vendas do produto');
        return;
      }

      if (saleItems && saleItems.length > 0) {
        toast.error('Não é possível excluir um produto que já foi vendido');
        return;
      }

      // Prosseguir com a exclusão se não houver vendas
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)
        .select();

      if (deleteError) {
        console.error('Erro ao excluir produto:', deleteError);
        toast.error('Erro ao excluir produto');
        return;
      }
      
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  return (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      {onEdit && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-100 transition-opacity"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(product)}>
              Editar produto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}