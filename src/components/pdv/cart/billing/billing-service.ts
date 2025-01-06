import { supabase } from "@/integrations/supabase/client";
import { Product } from "../../types";

interface Seller {
  id: string;
  name: string;
  commission_rate: number;
}

interface SaleData {
  items: (Product & { quantity: number })[];
  total: number;
  paymentMethod: string;
  selectedSellers: Seller[];
  sellerCommissions: Record<string, number>;
  discountPercentage: number;  // Added this field
}

export async function finalizeSale({
  items,
  total,
  paymentMethod,
  selectedSellers,
  sellerCommissions,
  discountPercentage
}: SaleData) {
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      total,
      payment_method: paymentMethod,
      sellers: selectedSellers.map(seller => ({
        id: seller.id,
        name: seller.name,
        commission_rate: sellerCommissions[seller.id]
      })),
      discount_percentage: discountPercentage  // Store the discount percentage
    })
    .select()
    .single();

  if (saleError) throw saleError;

  const saleItems = items.map(item => ({
    sale_id: sale.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from("sale_items")
    .insert(saleItems);

  if (itemsError) throw itemsError;

  // Update product stock
  for (const item of items) {
    if (!item.is_service) {
      const { error: stockError } = await supabase
        .from("products")
        .update({ stock: item.stock - item.quantity })
        .eq("id", item.id);

      if (stockError) throw stockError;
    }
  }

  return sale;
}