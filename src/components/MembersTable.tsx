import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Member, useMemberContext } from "@/contexts/MemberContext";
import { EditMemberDialog } from "./EditMemberDialog";
import { MembersFilter } from "./members/MembersFilter";
import { MemberTableRow } from "./members/MemberTableRow";
import { MembersTableHeader } from "./members/MembersTableHeader";
import { useMembers } from "./members/useMembers";
import { getMemberCode } from "./members/MemberCode";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members, isLoading } = useMemberContext();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const { filters, handleFilterChange, filteredMembers } = useMembers({
    members: members || [],
    planFilter,
  });

  const handleRowClick = async (member: Member) => {
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

    // Normalize status if needed
    const normalizedMember = {
      ...member,
      status: member.status === 'active' ? 'pago' :
              member.status === 'inactive' ? 'cancelado' :
              member.status === 'pago' ? 'pago' :
              member.status === 'cancelado' ? 'cancelado' :
              member.status === 'pendente' ? 'pendente' :
              'pendente'
    };

    setSelectedMember(normalizedMember);
    setDialogOpen(true);
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barber-gold"></div>
      </div>
    );
  }

  // Normalize status for all members
  const normalizedMembers = filteredMembers.map(member => ({
    ...member,
    status: member.status === 'active' ? 'pago' :
            member.status === 'inactive' ? 'cancelado' :
            member.status === 'pago' ? 'pago' :
            member.status === 'cancelado' ? 'cancelado' :
            member.status === 'pendente' ? 'pendente' :
            'pendente'
  }));

  // Remove duplicatas baseado no ID do membro
  const uniqueMembers = normalizedMembers.filter((member, index, self) =>
    index === self.findIndex((m) => m.id === member.id)
  );

  return (
    <div className="space-y-4">
      <MembersFilter
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="rounded-lg border border-barber-gray bg-barber-black">
        <Table>
          <MembersTableHeader />
          <TableBody>
            {uniqueMembers.map((member) => (
              <MemberTableRow
                key={member.id}
                member={member}
                memberCode={getMemberCode({ member, members: normalizedMembers })}
                onClick={() => handleRowClick(member)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditMemberDialog
        member={selectedMember}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}