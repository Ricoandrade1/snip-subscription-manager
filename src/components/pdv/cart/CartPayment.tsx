import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Wallet, Phone, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CartPaymentProps {
  items: (Product & { quantity: number })[];
  total: number;
  onClearCart: () => void;
}

export function CartPayment({ items, total, onClearCart }: CartPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  const handleFinishSale = async () => {
    if (items.length === 0) {
      toast.error("Adicione itens ao carrinho para finalizar a venda");
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Criar a venda
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          total,
          payment_method: paymentMethod,
          status: "completed"
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Criar os itens da venda
      const saleItems = items.map((item) => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // 3. Atualizar o estoque dos produtos
      for (const item of items) {
        if (!item.is_service) {
          const { error: stockError } = await supabase
            .from("products")
            .update({ stock: item.stock - item.quantity })
            .eq("id", item.id);

          if (stockError) throw stockError;
        }
      }

      toast.success("Venda finalizada com sucesso!");
      onClearCart();
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      toast.error("Erro ao finalizar venda");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
          <Label
            htmlFor="cash"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Wallet className="mb-2 h-6 w-6" />
            Dinheiro
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <CreditCard className="mb-2 h-6 w-6" />
            Cartão
          </Label>
        </div>

        <div>
          <RadioGroupItem value="mbway" id="mbway" className="peer sr-only" />
          <Label
            htmlFor="mbway"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Phone className="mb-2 h-6 w-6" />
            MBWay
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between items-center text-lg font-bold pt-4 border-t">
        <span>Total:</span>
        <span>
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
          }).format(total)}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClearCart}
          disabled={isProcessing}
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button
          className="flex-1"
          onClick={handleFinishSale}
          disabled={isProcessing}
        >
          {isProcessing ? "Processando..." : "Finalizar Venda"}
        </Button>
      </div>
    </Card>
  );
}