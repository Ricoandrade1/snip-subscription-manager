import { Button } from "@/components/ui/button";
import { Product } from "../types";
import { Minus, Plus, Trash } from "lucide-react";

interface CartItemProps {
  item: Product & { quantity: number };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
          Sem imagem
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
          }).format(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center">{item.quantity}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={!item.is_service && item.quantity >= item.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.id)}
          className="ml-2"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}