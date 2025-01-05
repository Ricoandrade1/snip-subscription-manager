import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

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
      // Create the sale
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

      // Create sale items and update stock
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

      // Update stock for each product
      for (const item of items) {
        const { data: updatedStock, error: stockError } = await supabase
          .from("products")
          .update({ stock: item.quantity })
          .eq("id", item.id)
          .select('stock')
          .single();

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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Carrinho</h2>
          {items.length > 0 && (
            <Button variant="outline" onClick={onClearCart}>
              Limpar
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Carrinho vazio
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(item.price)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(total)}
                </span>
              </div>

              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="money">Dinheiro</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="mbway">MBWay</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="w-full"
                onClick={handleFinishSale}
                disabled={isProcessing}
              >
                {isProcessing ? "Processando..." : "Finalizar Venda"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}