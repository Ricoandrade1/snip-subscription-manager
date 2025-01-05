import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "pix">("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleFinalizeSale = async () => {
    if (items.length === 0) {
      toast.error("Adicione itens ao carrinho");
      return;
    }

    setIsProcessing(true);

    try {
      // Create sale record
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

      // Create sale items
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

      // Update product stock
      for (const item of items) {
        const { data: currentProduct, error: productError } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        if (productError) throw productError;

        const newStock = currentProduct.stock - item.quantity;

        const { error: updateError } = await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.id);

        if (updateError) throw updateError;
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
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "EUR",
                }).format(item.price)}
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant={paymentMethod === "card" ? "default" : "outline"}
          onClick={() => setPaymentMethod("card")}
          className="flex-1"
        >
          Cartão
        </Button>
        <Button
          variant={paymentMethod === "cash" ? "default" : "outline"}
          onClick={() => setPaymentMethod("cash")}
          className="flex-1"
        >
          Dinheiro
        </Button>
        <Button
          variant={paymentMethod === "pix" ? "default" : "outline"}
          onClick={() => setPaymentMethod("pix")}
          className="flex-1"
        >
          PIX
        </Button>
      </div>

      <div className="text-2xl font-bold text-right">
        Total:{" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "EUR",
        }).format(total)}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClearCart}
          disabled={items.length === 0 || isProcessing}
          className="flex-1"
        >
          Limpar
        </Button>
        <Button
          onClick={handleFinalizeSale}
          disabled={items.length === 0 || isProcessing}
          className="flex-1 bg-barber-gold hover:bg-barber-gold/90"
        >
          Finalizar Venda
        </Button>
      </div>
    </div>
  );
}