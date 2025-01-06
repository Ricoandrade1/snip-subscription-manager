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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProductActionsProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export function ProductActions({ product, onEdit }: ProductActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // First check if there are any sales associated with this product
      const { data: saleItems, error: checkError } = await supabase
        .from('sale_items')
        .select('sale_id')
        .eq('product_id', product.id)
        .limit(1);

      if (checkError) {
        console.error('Error checking sale items:', checkError);
        toast.error('Erro ao verificar vendas associadas');
        return;
      }

      if (saleItems && saleItems.length > 0) {
        setSaleId(saleItems[0].sale_id);
        setShowDeleteDialog(true);
        return;
      }

      // If no sales are found, proceed with normal deletion confirmation
      if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
      }

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) {
        console.error('Error deleting product:', deleteError);
        toast.error('Erro ao excluir produto');
        return;
      }
      
      toast.success('Produto excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleDeleteWithPassword = async () => {
    if (adminPassword !== '1234') {
      toast.error('Senha de administrador incorreta');
      return;
    }

    try {
      setIsDeleting(true);

      // First, delete associated sale_items
      const { error: saleItemsError } = await supabase
        .from('sale_items')
        .delete()
        .eq('product_id', product.id);

      if (saleItemsError) {
        console.error('Error deleting sale items:', saleItemsError);
        toast.error('Erro ao excluir itens de venda');
        return;
      }

      // Then delete the product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) {
        console.error('Error deleting product:', deleteError);
        toast.error('Erro ao excluir produto');
        return;
      }

      toast.success('Produto excluído com sucesso');
      setShowDeleteDialog(false);
      setAdminPassword('');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    } finally {
      setIsDeleting(false);
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
          onClick={handleDeleteClick}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirmação de Exclusão
            </DialogTitle>
            <DialogDescription>
              Este produto possui vendas registradas no sistema. Para excluí-lo, 
              é necessário fornecer a senha de administrador.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {saleId && (
              <p className="text-sm text-muted-foreground">
                ID da venda associada: {saleId}
              </p>
            )}
            <div className="space-y-2">
              <label htmlFor="adminPassword" className="text-sm font-medium">
                Senha de Administrador
              </label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setAdminPassword('');
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWithPassword}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}