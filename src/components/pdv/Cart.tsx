import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CartHeader } from "./cart/CartHeader";
import { CartItem } from "./cart/CartItem";
import { CartPayment } from "./cart/CartPayment";

interface CartProps {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("money");

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinishSale = async () => {
    if (items.length === 0) {
      toast.error("Adicione itens ao carrinho");
      return;
    }

    setIsProcessing(true);

    try {
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert([
          {
            total,
            payment_method: paymentMethod,
            status: "completed",
          },
        ])
        .select()
        .single();

      if (saleError) throw saleError;

      const saleItems = items.map((item) => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(saleItems);

      if (itemsError) throw itemsError;

      for (const item of items) {
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: item.quantity })
          .eq("id", item.id);

        if (stockError) throw stockError;
      }

      toast.success("Venda finalizada com sucesso!");
      onClearCart();
    } catch (error) {
      console.error("Error processing sale:", error);
      toast.error("Erro ao processar venda");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <CartHeader onClear={onClearCart} hasItems={items.length > 0} />

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Carrinho vazio
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}

            <CartPayment
              total={total}
              paymentMethod={paymentMethod}
              isProcessing={isProcessing}
              onPaymentMethodChange={setPaymentMethod}
              onFinish={handleFinishSale}
              onCancel={onClearCart}
            />
          </div>
        )}
      </div>
    </Card>
  );
}