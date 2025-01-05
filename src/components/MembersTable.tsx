import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useMemberContext } from "@/contexts/MemberContext";
import { useState } from "react";
import type { Member } from "@/contexts/MemberContext";
import { EditMemberDialog } from "./EditMemberDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members, isLoading } = useMemberContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getMemberCode = (member: Member) => {
    // Get all members with the same plan, ordered by creation date
    const samePlanMembers = members
      .filter(m => m.plan === member.plan)
      .sort((a, b) => {
        const dateA = new Date(a.created_at || '1970-01-01');
        const dateB = new Date(b.created_at || '1970-01-01');
        return dateA.getTime() - dateB.getTime();
      });
    
    // Find the index of the current member in the sorted array
    const memberIndex = samePlanMembers.findIndex(m => m.id === member.id);
    
    // Format the sequence number with leading zeros (4 digits)
    const sequenceNumber = String(memberIndex + 1).padStart(4, '0');
    
    return `${member.plan} ${sequenceNumber}`;
  };

  const filteredMembers = members
    .filter((member) => !planFilter || member.plan === planFilter)
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aCode = getMemberCode(a);
      const bCode = getMemberCode(b);
      return aCode.localeCompare(bCode);
    });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

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
    <div className="space-y-4">
      <Input
        placeholder="Pesquisar por nome, apelido ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Apelido</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Data de Débito</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow 
              key={member.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleMemberClick(member)}
            >
              <TableCell className="font-medium">{getMemberCode(member)}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.nickname}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.plan}</TableCell>
              <TableCell>{member.debitDate}</TableCell>
            </TableRow>
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