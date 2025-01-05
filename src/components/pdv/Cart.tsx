import { Card } from "@/components/ui/card";
import { Product } from "./types";
import { CartHeader } from "./cart/CartHeader";
import { CartItem } from "./cart/CartItem";
import { CartPayment } from "./cart/CartPayment";

interface CartProps {
  items: (Product & { quantity: number })[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Card className="h-full flex flex-col">
      <CartHeader itemCount={items.length} />
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Carrinho vazio
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <CartPayment
          items={items}
          total={total}
          onClearCart={onClearCart}
        />
      </div>
    </Card>
  );
}