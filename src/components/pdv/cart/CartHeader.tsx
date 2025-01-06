import { ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-white">
      <ShoppingCart className="h-5 w-5 text-gray-500" />
      <h2 className="font-semibold text-gray-900">
        Carrinho {itemCount > 0 && `(${itemCount})`}
      </h2>
    </div>
  );
}