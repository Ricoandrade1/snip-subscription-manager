import { useState } from "react";
import { Member, MemberStatus } from "@/contexts/types";

interface FilterState {
  name: string;
  phone: string;
  nif: string;
  status: string;
  plan: string;
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
    status: "all",
    plan: planFilter || "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const normalizeStatus = (status: string): MemberStatus => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'pago':
        return 'pago';
      case 'inactive':
      case 'cancelado':
        return 'cancelado';
      case 'pendente':
        return 'pendente';
      default:
        return 'pendente';
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredMembers = members
    .map(member => ({
      ...member,
      status: normalizeStatus(member.status)
    }))
    .filter((member) => {
      const matchName = member.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchPhone = !filters.phone || (member.phone && member.phone.toLowerCase().includes(filters.phone.toLowerCase()));
      const matchNif = !filters.nif || (member.nif && member.nif.toLowerCase().includes(filters.nif.toLowerCase()));
      const matchStatus = filters.status === "all" || member.status === filters.status;
      const matchPlan = filters.plan === "all" || member.plan === filters.plan;

      return matchName && matchPhone && matchNif && matchStatus && matchPlan;
    })
    .sort((a, b) => {
      const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
      
      switch (filters.sortBy) {
        case "name":
          return sortOrder * a.name.localeCompare(b.name);
        case "payment_date":
          if (!a.payment_date && !b.payment_date) return 0;
          if (!a.payment_date) return sortOrder;
          if (!b.payment_date) return -sortOrder;
          return sortOrder * (new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime());
        case "plan":
          return sortOrder * (a.plan || "").localeCompare(b.plan || "");
        default:
          return 0;
      }
    });

  return {
    filters,
    handleFilterChange,
    filteredMembers,
  };
}