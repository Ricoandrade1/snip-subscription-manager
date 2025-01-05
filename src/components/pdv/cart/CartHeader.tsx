import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  onClear: () => void;
  hasItems: boolean;
}

export function CartHeader({ onClear, hasItems }: CartHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Carrinho</h2>
      {hasItems && (
        <Button variant="outline" onClick={onClear}>
          Limpar
        </Button>
      )}
    </div>
  );
}