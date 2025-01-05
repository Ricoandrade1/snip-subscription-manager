import { useState } from "react";
import { ProductList } from "@/components/pdv/ProductList";
import { Cart } from "@/components/pdv/Cart";
import { ProductServiceGrid } from "@/components/pdv/ProductServiceGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductServiceForm } from "@/components/pdv/ProductServiceForm";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function CashFlow() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="container py-2">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-barber-gold">
            Movimento de Caixa
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
              </DialogHeader>
              <ProductServiceForm
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-8">
          <ProductServiceGrid />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductList onProductSelect={handleProductSelect} />
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
}