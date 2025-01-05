import { Product } from "../types";
import { BillingForm } from "./billing/BillingForm";

interface CartPaymentProps {
  items: (Product & { quantity: number })[];
  total: number;
  onClearCart: () => void;
}

export function CartPayment({ items, total, onClearCart }: CartPaymentProps) {
  return (
    <BillingForm
      items={items}
      total={total}
      onClearCart={onClearCart}
    />
  );
}