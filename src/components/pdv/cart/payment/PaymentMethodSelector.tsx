import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Phone } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function PaymentMethodSelector({ value, onValueChange }: PaymentMethodSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
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
  );
}