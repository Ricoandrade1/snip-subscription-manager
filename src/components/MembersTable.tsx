import { Table, TableBody } from "@/components/ui/table";
import { useMemberContext } from "@/contexts/MemberContext";
import { useState } from "react";
import type { Member } from "@/contexts/MemberContext";
import { EditMemberDialog } from "./EditMemberDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MembersFilter } from "./members/MembersFilter";
import { MemberTableRow } from "./members/MemberTableRow";
import { MembersTableHeader } from "./members/MembersTableHeader";
import { useMembers } from "./members/useMembers";
import { getMemberCode } from "./members/MemberCode";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members, isLoading } = useMemberContext();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { filters, handleFilterChange, filteredMembers } = useMembers({
    members,
    planFilter,
  });

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

  return (
    <div className="space-y-6">
      <MembersFilter filters={filters} onFilterChange={handleFilterChange} />

      <Table>
        <MembersTableHeader />
        <TableBody>
          {filteredMembers.map((member) => (
            <MemberTableRow
              key={member.id}
              member={member}
              memberCode={getMemberCode({ member, members })}
              onClick={() => {
                setSelectedMember(member);
                setDialogOpen(true);
              }}
            />
          ))}
        </TableBody>
      </Table>

      <EditMemberDialog
        member={selectedMember}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}