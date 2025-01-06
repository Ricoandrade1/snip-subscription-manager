import { Product } from "../types";
import { BillingForm } from "./billing/BillingForm";

interface CartPaymentProps {
  items: (Product & { quantity: number })[];
  subtotal: number;
  discountPercentage: number;
  onDiscountChange: (value: number) => void;
  total: number;
  onClearCart: () => void;
}

export function CartPayment({ 
  items, 
  subtotal,
  discountPercentage,
  onDiscountChange,
  total, 
  onClearCart 
}: CartPaymentProps) {
  return (
    <BillingForm
      items={items}
      subtotal={subtotal}
      discountPercentage={discountPercentage}
      onDiscountChange={onDiscountChange}
      total={total}
      onClearCart={onClearCart}
    />
  );
}