import { Card } from "@/components/ui/card";
import { Product } from "./types";
import { CartHeader } from "./cart/CartHeader";
import { CartItem } from "./cart/CartItem";
import { CartPayment } from "./cart/CartPayment";
import { useState } from "react";

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
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discountAmount;

  return (
    <Card className="h-full flex flex-col">
      <CartHeader itemCount={items.length} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

      <div className="p-4 border-t flex-shrink-0">
        <CartPayment
          items={items}
          subtotal={subtotal}
          discountPercentage={discountPercentage}
          onDiscountChange={setDiscountPercentage}
          total={total}
          onClearCart={onClearCart}
        />
      </div>
    </Card>
  );
}