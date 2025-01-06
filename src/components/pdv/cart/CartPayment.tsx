import { Product } from "../types";
import { BillingForm } from "./billing/BillingForm";

interface CartPaymentProps {
  items: (Product & { quantity: number })[];
  subtotal: number;
  discountPercentage: number;
  onDiscountChange: (value: number) => void;
  vatAmount: number;
  total: number;
  onClearCart: () => void;
}

export function CartPayment({ 
  items, 
  subtotal,
  discountPercentage,
  onDiscountChange,
  vatAmount,
  total, 
  onClearCart 
}: CartPaymentProps) {
  return (
    <BillingForm
      items={items}
      subtotal={subtotal}
      discountPercentage={discountPercentage}
      onDiscountChange={onDiscountChange}
      vatAmount={vatAmount}
      total={total}
      onClearCart={onClearCart}
    />
  );
}