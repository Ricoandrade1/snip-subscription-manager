import { Table, TableBody } from "@/components/ui/table";
import { useMemberContext } from "@/contexts/MemberContext";
import { useState } from "react";
import type { Member } from "@/contexts/MemberContext";
import { EditMemberDialog } from "./EditMemberDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MembersFilter } from "./MembersFilter";
import { MemberTableRow } from "./members/MemberTableRow";
import { MembersTableHeader } from "./members/MembersTableHeader";
import { useMembers } from "./members/useMembers";
import { getMemberCode } from "./members/MemberCode";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

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
    members,
    planFilter,
  });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[300px]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-barber-light/60">Nenhum membro encontrado</p>
      </div>
    );
  }

  const displayMembers = filteredMembers.length > 0 ? filteredMembers : members;

  return (
    <div className="space-y-6">
      <MembersFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="rounded-lg overflow-hidden border border-barber-gray">
        <Table>
          <MembersTableHeader />
          <TableBody>
            {displayMembers.map((member) => (
              <MemberTableRow
                key={member.id}
                member={member}
                memberCode={getMemberCode({ member, members })}
                onClick={() => handleMemberClick(member)}
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