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
      <div className="flex-shrink-0">
        <CartHeader itemCount={items.length} />
      </div>
      
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground py-8">
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
      </div>

      <div className="flex-shrink-0 border-t">
        <CartPayment
          items={items}
          total={total}
          onClearCart={onClearCart}
        />
      </div>
    </Card>
  );
}