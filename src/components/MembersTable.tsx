import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemberContext } from "@/contexts/MemberContext";
import { useState } from "react";
import type { Member } from "@/contexts/MemberContext";
import { EditMemberDialog } from "./EditMemberDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MembersFilter } from "./members/MembersFilter";
import { MemberTableRow } from "./members/MemberTableRow";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

interface FilterState {
  name: string;
  phone: string;
  nif: string;
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members, isLoading } = useMemberContext();
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
  });
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getMemberCode = (member: Member) => {
    const samePlanMembers = members
      .filter(m => m.plan === member.plan)
      .sort((a, b) => {
        const dateA = new Date(a.created_at || '1970-01-01');
        const dateB = new Date(b.created_at || '1970-01-01');
        return dateA.getTime() - dateB.getTime();
      });
    
    const memberIndex = samePlanMembers.findIndex(m => m.id === member.id);
    const sequenceNumber = String(memberIndex + 1).padStart(4, '0');
    
    return `${member.plan} ${sequenceNumber}`;
  };

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
    })
    .sort((a, b) => {
      const aCode = getMemberCode(a);
      const bCode = getMemberCode(b);
      return aCode.localeCompare(bCode);
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
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Apelido</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <MemberTableRow
              key={member.id}
              member={member}
              memberCode={getMemberCode(member)}
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