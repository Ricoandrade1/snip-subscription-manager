import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FilterBadges } from "./filters/FilterBadges";
import { FilterFields } from "./filters/FilterFields";
import { ProductListFilters } from "./types";

interface ProductFilterProps {
  filters: ProductListFilters;
  onFilterChange: (filters: ProductListFilters) => void;
}

export function ProductFilter({ filters, onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  const fetchCategoriesAndBrands = async () => {
    const [categoriesResponse, brandsResponse] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("brands").select("*").order("name"),
    ]);

    if (categoriesResponse.data) {
      setCategories(categoriesResponse.data);
    }
    if (brandsResponse.data) {
      setBrands(brandsResponse.data);
    }
  };

  const handleFilterChange = (field: keyof ProductListFilters, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleClearFilter = (field: keyof ProductListFilters) => {
    onFilterChange({
      ...filters,
      [field]: field === "category" || field === "brand" ? "all" : field === "inStock" ? false : "",
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      name: "",
      category: "all",
      brand: "all",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
  };

  return (
    <div className="space-y-4">
      <FilterFields
        filters={filters}
        categories={categories}
        brands={brands}
        onFilterChange={handleFilterChange}
      />
      <FilterBadges
        filters={filters}
        categories={categories}
        brands={brands}
        onClearFilter={handleClearFilter}
        onClearAll={handleClearAll}
      />
    </div>
  );
}