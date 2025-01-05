import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Buscar por nome..."
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) => handleChange("brand", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPrice">Preço Mínimo</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="€"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Preço Máximo</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="€"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => handleChange("inStock", checked)}
          />
          <Label htmlFor="inStock">Apenas em estoque</Label>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter(filter)}
              />
            </Badge>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Limpar todos
          </button>
        </div>
      )}
    </div>
  );
}