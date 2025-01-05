import { Input } from "@/components/ui/input";

interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

interface CommissionDisplayProps {
  selectedSellers: Seller[];
  total: number;
  commissionRates: Record<string, number>;
  onCommissionChange: (sellerId: string, newRate: number) => void;
}

export function CommissionDisplay({ 
  selectedSellers, 
  total, 
  commissionRates,
  onCommissionChange 
}: CommissionDisplayProps) {
  const calculateCommission = (sellerId: string) => {
    const rate = commissionRates[sellerId] || 0;
    return (total * rate) / 100;
  };

  if (selectedSellers.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t">
      <p className="text-sm font-medium">Comissões:</p>
      {selectedSellers.map((seller) => (
        <div key={seller.id} className="flex items-center justify-between gap-4 text-sm">
          <span>{seller.name}</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={commissionRates[seller.id] || seller.commission_rate}
              onChange={(e) => onCommissionChange(seller.id, parseFloat(e.target.value) || 0)}
              className="w-20 h-8 text-right"
            />
            <span className="w-16">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(calculateCommission(seller.id))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}