import { Card } from "@/components/ui/card";
import { Product } from "./types";
import { Package, Scissors, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({ product, onSelect, onEdit, onDelete }: ProductCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      onDelete?.(product.id);
      setIsDeleteDialogOpen(false);
      toast.success("Produto removido com sucesso");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erro ao remover produto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer hover:bg-muted/50"
      onClick={() => onSelect(product)}
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
                  <DropdownMenuSeparator />
                  <AlertDialog 
                    open={isDeleteDialogOpen} 
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover produto
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover produto</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover o produto "{product.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Removendo..." : "Remover"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}