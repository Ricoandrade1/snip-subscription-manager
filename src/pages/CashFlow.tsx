import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductServiceForm } from "@/components/pdv/forms/ProductServiceForm";
import { toast } from "sonner";

const CashFlow = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      toast.error("Erro ao carregar produtos");
      return;
    }

    setProducts(data);
  };

  const handleSuccess = () => {
    fetchProducts();
  };

  return (
    <div>
      <h1>Fluxo de Caixa</h1>
      <ProductServiceForm onSuccess={handleSuccess} />
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CashFlow;
