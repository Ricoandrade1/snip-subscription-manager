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
    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-white hover:shadow-sm transition-shadow">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
          Sem imagem
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
          }).format(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center font-medium">{item.quantity}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={!item.is_service && item.quantity >= item.stock}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.id)}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 ml-2"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}