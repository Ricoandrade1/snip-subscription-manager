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
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-14 h-14 object-cover rounded"
        />
      ) : (
        <div className="w-14 h-14 bg-muted rounded flex items-center justify-center">
          Sem imagem
        </div>
      )}

      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
          }).format(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="h-7 w-7"
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-6 text-center">{item.quantity}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={!item.is_service && item.quantity >= item.stock}
          className="h-7 w-7"
        >
          <Plus className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.id)}
          className="h-7 w-7 ml-1"
        >
          <Trash className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}