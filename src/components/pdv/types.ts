import { Json } from "@/integrations/supabase/types";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  brand_id: string | null;
  category_id: string | null;
  brands?: {
    name: string;
  };
  categories?: {
    name: string;
  };
  commission_rates?: Record<string, number>;
  image_url?: string | null;
  description?: string | null;
}

export interface ProductListFilters {
  name: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}