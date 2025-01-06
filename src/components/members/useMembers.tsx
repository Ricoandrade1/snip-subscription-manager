import { useState } from "react";
import { Member } from "@/contexts/MemberContext";

interface FilterState {
  name: string;
  phone: string;
  nif: string;
  sortBy: 'name' | 'payment_date' | 'plan';
  sortOrder: 'asc' | 'desc';
}

interface UseMembersProps {
  members: Member[];
  planFilter?: "Basic" | "Classic" | "Business";
}

export function useMembers({ members, planFilter }: UseMembersProps) {
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const sortMembers = (members: Member[]) => {
    return [...members].sort((a, b) => {
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'name':
          return sortOrder * a.name.localeCompare(b.name);
        case 'payment_date':
          if (!a.payment_date && !b.payment_date) return 0;
          if (!a.payment_date) return sortOrder;
          if (!b.payment_date) return -sortOrder;
          return sortOrder * (new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime());
        case 'plan':
          if (!a.plan && !b.plan) return 0;
          if (!a.plan) return sortOrder;
          if (!b.plan) return -sortOrder;
          return sortOrder * (a.plan || '').localeCompare(b.plan || '');
        default:
          return 0;
      }
    });
  };

  const filteredMembers = sortMembers(
    members.filter((member) => {
      const matchName = member.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchPhone = !filters.phone || (member.phone && member.phone.toLowerCase().includes(filters.phone.toLowerCase()));
      const matchNif = !filters.nif || (member.nif && member.nif.toLowerCase().includes(filters.nif.toLowerCase()));
      const matchPlan = !planFilter || member.plan === planFilter;

      return matchName && matchPhone && matchNif && matchPlan;
    })
  );

  return {
    filters,
    handleFilterChange,
    filteredMembers,
  };
}