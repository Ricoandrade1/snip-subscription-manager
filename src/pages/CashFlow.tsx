import { useState } from "react";
import { ProductList } from "@/components/pdv/ProductList";
import { Cart } from "@/components/pdv/Cart";
import { Product } from "@/components/pdv/types";
import { ProductFilter } from "@/components/products/ProductFilter";
import { toast } from "sonner";

export default function CashFlow() {
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  const handleProductSelect = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleFinishSale = async () => {
    if (cartItems.length === 0) {
      toast.error("Adicione itens ao carrinho para finalizar a venda");
      return;
    }
    // Cart component will handle the sale finalization
  };

  return (
    <div className="container py-6 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full gap-6">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="mb-6 space-y-4">
            <h1 className="text-2xl font-bold">PDV</h1>
            <ProductFilter filters={filters} onFilterChange={setFilters} />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-6 -mr-6">
            <ProductList
              filters={filters}
              onProductSelect={handleProductSelect}
            />
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-[400px] flex-shrink-0">
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