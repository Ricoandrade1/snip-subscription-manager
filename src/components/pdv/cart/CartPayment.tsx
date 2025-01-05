import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Wallet, Phone, X, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [barbers, setBarbers] = useState<Seller[]>([]);

  // Fetch barbers on component mount
  useEffect(() => {
    const fetchBarbers = async () => {
      const { data, error } = await supabase
        .from("barbers")
        .select("id, name, commission_rate")
        .eq("status", "active");

      if (error) {
        toast.error("Erro ao carregar barbeiros");
        return;
      }

      if (data) {
        setBarbers(data);
      }
    };

    fetchBarbers();
  }, []);

  const handleSelectSeller = (seller: Seller) => {
    setSelectedSellers((current) => {
      const exists = current.find((s) => s.id === seller.id);
      if (exists) {
        return current.filter((s) => s.id !== seller.id);
      }
      return [...current, seller];
    });
  };

  const calculateCommission = (seller: Seller) => {
    const commission = (total * seller.commission_rate) / 100;
    return commission;
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

      // 1. Criar a venda
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          total,
          payment_method: paymentMethod,
          status: "completed",
          sellers: selectedSellers.map(s => ({
            id: s.id,
            commission: calculateCommission(s)
          }))
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
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              {selectedSellers.length === 0
                ? "Selecionar Vendedor"
                : `${selectedSellers.length} vendedor(es)`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Vendedores</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {barbers.map((barber) => (
              <DropdownMenuItem
                key={barber.id}
                onClick={() => handleSelectSeller(barber)}
                className="flex items-center justify-between"
              >
                <span>{barber.name}</span>
                {selectedSellers.some((s) => s.id === barber.id) && (
                  <span className="text-green-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedSellers.length > 0 && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm font-medium">Comissões:</p>
          {selectedSellers.map((seller) => (
            <div key={seller.id} className="flex justify-between text-sm">
              <span>{seller.name}</span>
              <span>
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                }).format(calculateCommission(seller))}
                {" "}
                ({seller.commission_rate}%)
              </span>
            </div>
          ))}
        </div>
      )}

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