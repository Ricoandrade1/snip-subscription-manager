import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center gap-2">
      <ShoppingCart className="h-5 w-5" />
      <h2 className="font-semibold">
        Carrinho {itemCount > 0 && `(${itemCount})`}
      </h2>
    </div>
  );
}