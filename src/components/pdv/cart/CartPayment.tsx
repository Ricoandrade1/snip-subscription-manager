import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Wallet, Banknote } from "lucide-react";

interface CartPaymentProps {
  total: number;
  paymentMethod: string;
  isProcessing: boolean;
  onPaymentMethodChange: (value: string) => void;
  onFinish: () => void;
  onCancel: () => void;
}

export function CartPayment({
  total,
  paymentMethod,
  isProcessing,
  onPaymentMethodChange,
  onFinish,
  onCancel,
}: CartPaymentProps) {
  return (
    <div className="space-y-4">
      <Separator />
      
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
          }).format(total)}
        </span>
      </div>

      <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <SelectTrigger>
          <SelectValue placeholder="Forma de pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="money">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Dinheiro
            </div>
          </SelectItem>
          <SelectItem value="card">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Cartão
            </div>
          </SelectItem>
          <SelectItem value="mbway">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              MBWay
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button onClick={onFinish} disabled={isProcessing}>
          {isProcessing ? "Processando..." : "Finalizar Venda"}
        </Button>
      </div>
    </div>
  );
}