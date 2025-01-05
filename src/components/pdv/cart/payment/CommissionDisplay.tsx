interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

interface CommissionDisplayProps {
  selectedSellers: Seller[];
  total: number;
}

export function CommissionDisplay({ selectedSellers, total }: CommissionDisplayProps) {
  const calculateCommission = (seller: Seller) => {
    return (total * seller.commission_rate) / 100;
  };

  if (selectedSellers.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t">
      <p className="text-sm font-medium">Comissões:</p>
      {selectedSellers.map((seller) => (
        <div key={seller.id} className="flex justify-between text-sm">
          <span>{seller.name}</span>
          <span>
            {new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(calculateCommission(seller))}
            {" "}
            ({seller.commission_rate}%)
          </span>
        </div>
      ))}
    </div>
  );
}