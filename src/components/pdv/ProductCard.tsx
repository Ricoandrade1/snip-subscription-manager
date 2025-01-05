import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
  barbers: { id: string; name: string }[];
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, barbers, onSelect }: ProductCardProps) {
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
        <div className="text-2xl font-bold text-barber-gold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "EUR",
          }).format(product.price)}
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
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