import { Package, Scissors } from "lucide-react";

interface ProductIconProps {
  isService: boolean;
}

export function ProductIcon({ isService }: ProductIconProps) {
  return (
    <div className="rounded-full bg-muted p-2">
      {isService ? (
        <Scissors className="h-5 w-5 text-primary" />
      ) : (
        <Package className="h-5 w-5 text-primary" />
      )}
    </div>
  );
}