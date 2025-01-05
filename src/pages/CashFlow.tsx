import { useState } from "react";
import { ProductList } from "@/components/pdv/ProductList";
import { Cart } from "@/components/pdv/Cart";
import { ProductServiceGrid } from "@/components/pdv/ProductServiceGrid";

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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-barber-gold mb-8">
          Movimento de Caixa
        </h1>
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