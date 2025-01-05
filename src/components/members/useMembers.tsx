import { useState } from "react";
import { Member } from "@/contexts/MemberContext";

interface FilterState {
  name: string;
  phone: string;
  nif: string;
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
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredMembers = members
    .filter((member) => !planFilter || member.plan === planFilter)
    .filter((member) => {
      const matchName = member.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchPhone = !filters.phone || (member.phone && member.phone.toLowerCase().includes(filters.phone.toLowerCase()));
      const matchNif = !filters.nif || (member.nif && member.nif.toLowerCase().includes(filters.nif.toLowerCase()));

      return matchName && matchPhone && matchNif;
    });

  return {
    filters,
    handleFilterChange,
    filteredMembers,
  };
}