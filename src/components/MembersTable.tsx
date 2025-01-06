import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Member } from "@/contexts/types";
import { EditMemberDialog } from "./EditMemberDialog";
import { MembersFilter } from "./members/MembersFilter";
import { MemberTableRow } from "./members/MemberTableRow";
import { MembersTableHeader } from "./members/MembersTableHeader";
import { useMembers } from "./members/useMembers";
import { getMemberCode } from "./members/MemberCode";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useMemberSelection } from "./members/useMemberSelection";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members, isLoading } = useMemberContext();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  const { handleMemberSelection } = useMemberSelection({
    setSelectedMember,
    setDialogOpen
  });

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const { filters, handleFilterChange, filteredMembers } = useMembers({
    members: members || [],
    planFilter,
  });

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

  // Remove duplicatas baseado no ID do membro
  const uniqueMembers = filteredMembers.filter((member, index, self) =>
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
                memberCode={getMemberCode({ member, members: filteredMembers })}
                onClick={() => handleMemberSelection(member)}
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