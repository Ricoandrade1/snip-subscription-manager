import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Product } from "./types";
import { Scissors, Package, Percent, DollarSign, Info } from "lucide-react";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, barbers, onSelect }: ProductCardProps) {
  const vatAmount = product.price * (product.vat_rate / 100);
  const totalWithVat = product.vat_included ? product.price : product.price + vatAmount;
  const priceWithoutVat = product.vat_included ? product.price - vatAmount : product.price;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        product.stock === 0 ? 'opacity-50' : ''
      }`}
      onClick={() => {
        if (product.stock > 0) {
          onSelect(product);
        } else {
          toast.error("Produto sem estoque");
        }
      }}
    >
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        {product.is_service ? (
          <div className="rounded-full bg-purple-500/10 p-2 text-purple-500">
            <Scissors className="h-4 w-4" />
          </div>
        ) : (
          <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
            <Package className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="relative">
        {product.image_url ? (
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-semibold leading-none tracking-tight">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground">{product.description}</p>
          )}
        </div>

        <div className="space-y-2">
          {product.vat_rate > 0 ? (
            <div className="space-y-1 rounded-lg bg-muted/50 p-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Base:
                </span>
                <span>
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(priceWithoutVat)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  IVA ({product.vat_rate}%):
                </span>
                <span>
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(vatAmount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-1 font-medium">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalWithVat)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold">
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(product.price)}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className={`rounded-full bg-muted px-2 py-1 ${
            product.stock === 0 ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            Estoque: {product.stock}
          </div>
          
          {product.brands && (
            <div className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
              {product.brands.name}
            </div>
          )}
          
          {product.categories && (
            <div className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
              {product.categories.name}
            </div>
          )}
        </div>

        {product.commission_rates && Object.keys(product.commission_rates).length > 0 && (
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Percent className="h-4 w-4" />
              Comissões
            </div>
            <div className="grid gap-1">
              {Object.entries(product.commission_rates).map(([barberId, rate]) => {
                const barber = barbers.find(b => b.id === barberId);
                return barber && (
                  <div key={barberId} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{barber.name}</span>
                    <span className="font-medium">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}