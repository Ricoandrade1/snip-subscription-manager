import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FilterInputs } from "./filters/FilterInputs";
import { FilterBadges } from "./filters/FilterBadges";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductServiceForm } from "@/components/pdv/ProductServiceForm";

interface FilterState {
  name: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilter({ filters, onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategoriesAndBrands();
    updateActiveFilters();
  }, [filters]);

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

  const updateActiveFilters = () => {
    const active: string[] = [];
    if (filters.name) active.push(`Nome: ${filters.name}`);
    if (filters.category && filters.category !== "all") {
      const category = categories.find(c => c.id === filters.category);
      if (category) active.push(`Categoria: ${category.name}`);
    }
    if (filters.brand && filters.brand !== "all") {
      const brand = brands.find(b => b.id === filters.brand);
      if (brand) active.push(`Marca: ${brand.name}`);
    }
    if (filters.minPrice) active.push(`Preço min: €${filters.minPrice}`);
    if (filters.maxPrice) active.push(`Preço max: €${filters.maxPrice}`);
    if (filters.inStock) active.push("Em estoque");
    setActiveFilters(active);
  };

  const handleChange = (field: keyof FilterState, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilter = (filter: string) => {
    const field = filter.split(":")[0].toLowerCase();
    switch (field) {
      case "nome":
        handleChange("name", "");
        break;
      case "categoria":
        handleChange("category", "all");
        break;
      case "marca":
        handleChange("brand", "all");
        break;
      case "preço min":
        handleChange("minPrice", "");
        break;
      case "preço max":
        handleChange("maxPrice", "");
        break;
      case "em estoque":
        handleChange("inStock", false);
        break;
    }
  };

  const clearAllFilters = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
        <FilterInputs
          filters={filters}
          categories={categories}
          brands={brands}
          onFilterChange={handleChange}
        />
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleChange("inStock", checked)}
            />
            <Label htmlFor="inStock">Apenas em estoque</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 px-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Produto
          </Button>
        </div>
      </div>

      <FilterBadges
        activeFilters={activeFilters}
        onClearFilter={clearFilter}
        onClearAllFilters={clearAllFilters}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
          </DialogHeader>
          <ProductServiceForm
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}