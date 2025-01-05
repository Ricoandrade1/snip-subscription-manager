import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X } from "lucide-react";
import { SellerSelector } from "./payment/SellerSelector";
import { CommissionDisplay } from "./payment/CommissionDisplay";
import { PaymentMethodSelector } from "./payment/PaymentMethodSelector";

interface CartPaymentProps {
  items: (Product & { quantity: number })[];
  total: number;
  onClearCart: () => void;
}

interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

export function CartPayment({ items, total, onClearCart }: CartPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [selectedSellers, setSelectedSellers] = useState<Seller[]>([]);

  const handleSelectSeller = (seller: Seller) => {
    setSelectedSellers((current) => {
      const exists = current.find((s) => s.id === seller.id);
      if (exists) {
        return current.filter((s) => s.id !== seller.id);
      }
      return [...current, seller];
    });
  };

  const handleFinishSale = async () => {
    if (items.length === 0) {
      toast.error("Adicione itens ao carrinho para finalizar a venda");
      return;
    }

    if (selectedSellers.length === 0) {
      toast.error("Selecione pelo menos um vendedor");
      return;
    }

    try {
      setIsProcessing(true);

      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          total,
          payment_method: paymentMethod,
          status: "completed",
          sellers: selectedSellers.map(s => ({
            id: s.id,
            commission: (total * s.commission_rate) / 100
          }))
        })
        .select()
        .single();

      if (saleError) throw saleError;

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
      <SellerSelector
        selectedSellers={selectedSellers}
        onSelectSeller={handleSelectSeller}
      />

      <CommissionDisplay
        selectedSellers={selectedSellers}
        total={total}
      />

      <PaymentMethodSelector
        value={paymentMethod}
        onValueChange={setPaymentMethod}
      />

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