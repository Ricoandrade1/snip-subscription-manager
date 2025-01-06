import { Card } from "@/components/ui/card";
import { Product } from "./types";
import { CartHeader } from "./cart/CartHeader";
import { CartItem } from "./cart/CartItem";
import { CartPayment } from "./cart/CartPayment";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Calculate subtotal (before VAT)
  const subtotal = items.reduce((acc, item) => {
    const priceWithoutVAT = item.vat_included 
      ? item.price / (1 + item.vat_rate / 100)
      : item.price;
    return acc + priceWithoutVAT * item.quantity;
  }, 0);

  // Calculate VAT (before discount)
  const vatAmount = items.reduce((acc, item) => {
    const itemSubtotal = item.vat_included 
      ? (item.price / (1 + item.vat_rate / 100)) * item.quantity
      : item.price * item.quantity;
    return acc + (itemSubtotal * item.vat_rate / 100);
  }, 0);

  // Calculate discount amount (applies to subtotal + VAT)
  const discountAmount = ((subtotal + vatAmount) * discountPercentage) / 100;

  // Calculate final total
  const total = subtotal + vatAmount - discountAmount;

  return (
    <Card className="h-full flex flex-col bg-white shadow-md">
      <CartHeader itemCount={items.length} />
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-gray-50">
        <CartPayment
          items={items}
          subtotal={subtotal}
          discountPercentage={discountPercentage}
          onDiscountChange={setDiscountPercentage}
          vatAmount={vatAmount}
          total={total}
          onClearCart={onClearCart}
        />
      </div>
    </Card>
  );
}