import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Product } from "./types";

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
      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col justify-between h-full ${
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
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="w-full h-32 bg-muted rounded-md mb-4 flex items-center justify-center">
          Sem imagem
        </div>
      )}
      
      <div className="space-y-2">
        <div className="text-lg font-medium">{product.name}</div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Preço sem IVA:</span>
            <span>
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(priceWithoutVat)}
            </span>
          </div>
          
          <div className="flex justify-between text-muted-foreground">
            <span>IVA ({product.vat_rate}%):</span>
            <span>
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(vatAmount)}
            </span>
          </div>
          
          <div className="flex justify-between font-bold pt-1 border-t">
            <span>Total com IVA:</span>
            <span>
              {new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(totalWithVat)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
          <div className={`${product.stock === 0 ? 'text-red-500' : ''}`}>
            Estoque: {product.stock}
          </div>
          {product.brands && (
            <div>Marca: {product.brands.name}</div>
          )}
          {product.categories && (
            <div>Categoria: {product.categories.name}</div>
          )}
        </div>

        {product.commission_rates && Object.keys(product.commission_rates).length > 0 && (
          <div className="text-xs border-t border-border pt-2 mt-2">
            <div className="font-medium mb-1">Comissões:</div>
            <div className="space-y-1">
              {Object.entries(product.commission_rates).map(([barberId, rate]) => {
                const barber = barbers.find(b => b.id === barberId);
                return (
                  <div key={barberId} className="flex justify-between">
                    <span>{barber?.name || 'Barbeiro'}:</span>
                    <span>{rate}%</span>
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