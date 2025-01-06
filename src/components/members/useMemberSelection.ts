import { useState } from "react";
import { Member, MemberStatus } from "@/contexts/types";
import { supabase } from "@/integrations/supabase/client";

interface UseMemberSelectionProps {
  setSelectedMember: (member: Member | null) => void;
  setDialogOpen: (open: boolean) => void;
}

export function useMemberSelection({ setSelectedMember, setDialogOpen }: UseMemberSelectionProps) {
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

  const handleMemberSelection = async (member: Member) => {
    if (member.plan_id && !member.plan) {
      const { data: planData } = await supabase
        .from('plans')
        .select('title')
        .eq('id', member.plan_id)
        .single();
      
      if (planData) {
        member.plan = planData.title as Member["plan"];
      }
    }

    const normalizedMember: Member = {
      ...member,
      status: normalizeStatus(member.status)
    };

    setSelectedMember(normalizedMember);
    setDialogOpen(true);
  };

  return {
    handleMemberSelection
  };
}