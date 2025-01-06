import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Product } from "../../types";
import { SellerSelector } from "../payment/SellerSelector";
import { CommissionDisplay } from "../payment/CommissionDisplay";
import { PaymentMethodSelector } from "../payment/PaymentMethodSelector";
import { finalizeSale } from "./billing-service";
import { toast } from "sonner";

interface BillingFormProps {
  items: (Product & { quantity: number })[];
  subtotal: number;
  discountPercentage: number;
  onDiscountChange: (value: number) => void;
  total: number;
  onClearCart: () => void;
}

interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

export function BillingForm({ 
  items, 
  subtotal,
  discountPercentage,
  onDiscountChange,
  total, 
  onClearCart 
}: BillingFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [selectedSellers, setSelectedSellers] = useState<Seller[]>([]);
  const [sellerCommissions, setSellerCommissions] = useState<Record<string, number>>({});

  const handleSelectSeller = (seller: Seller) => {
    setSelectedSellers((current) => {
      const exists = current.find((s) => s.id === seller.id);
      if (exists) {
        return current.filter((s) => s.id !== seller.id);
      }
      setSellerCommissions(prev => ({
        ...prev,
        [seller.id]: seller.commission_rate
      }));
      return [...current, seller];
    });
  };

  const handleCommissionChange = (sellerId: string, newRate: number) => {
    setSellerCommissions(prev => ({
      ...prev,
      [sellerId]: newRate
    }));
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= 100) {
      onDiscountChange(value);
    }
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
      await finalizeSale({
        items,
        total,
        paymentMethod,
        selectedSellers,
        sellerCommissions,
        discountPercentage
      });
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
        commissionRates={sellerCommissions}
        onCommissionChange={handleCommissionChange}
      />

      <PaymentMethodSelector
        value={paymentMethod}
        onValueChange={setPaymentMethod}
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Subtotal:</span>
          <span className="text-sm">
            {new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(subtotal)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Desconto (%):</span>
          <Input
            type="number"
            min="0"
            max="100"
            value={discountPercentage}
            onChange={handleDiscountChange}
            className="w-20 h-8"
          />
          <span className="text-sm text-muted-foreground">
            ({new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(subtotal * discountPercentage / 100)})
          </span>
        </div>

        <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
          <span>Total:</span>
          <span>
            {new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(total)}
          </span>
        </div>
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