import { useState } from "react";
import { FilterState } from "../types/subscriber";

export function useSubscribersFilters() {
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    plan: "all",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return {
    filters,
    handleFilterChange,
  };
}