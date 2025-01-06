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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ProductActionsProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export function ProductActions({ product, onEdit }: ProductActionsProps) {
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [saleId, setSaleId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      // First check if there are any sales associated with this product
      const { data: saleItems, error: checkError } = await supabase
        .from('sale_items')
        .select('sale_id')
        .eq('product_id', product.id)
        .limit(1);

      if (checkError) throw checkError;

      if (saleItems && saleItems.length > 0) {
        setSaleId(saleItems[0].sale_id);
        setShowErrorDialog(true);
        return;
      }

      // If no sales are found, proceed with deletion
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
    <>
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
          className="opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Não é possível excluir este produto
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Este produto não pode ser excluído pois já possui vendas registradas no sistema.
            </p>
            {saleId && (
              <p className="text-sm text-muted-foreground">
                ID da venda associada: {saleId}
              </p>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowErrorDialog(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}