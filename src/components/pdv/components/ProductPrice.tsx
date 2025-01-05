interface ProductPriceProps {
  price: number;
  stock?: number;
  isService?: boolean;
}

export function ProductPrice({ price, stock, isService }: ProductPriceProps) {
  return (
    <div className="text-right">
      <p className="font-semibold">
        {new Intl.NumberFormat("pt-PT", {
          style: "currency",
          currency: "EUR",
        }).format(price)}
      </p>
      {!isService && (
        <p className="text-sm text-muted-foreground">
          Stock: {stock}
        </p>
      )}
    </div>
  );
}