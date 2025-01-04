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

  const filteredMembers = members
    .filter((member) => !planFilter || member.plan === planFilter)
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aCode = `${a.plan} ${String(
        members.filter((m) => m.plan === a.plan && m.id < a.id).length + 1
      ).padStart(2, "0")}`;
      const bCode = `${b.plan} ${String(
        members.filter((m) => m.plan === b.plan && m.id < b.id).length + 1
      ).padStart(2, "0")}`;
      return aCode.localeCompare(bCode);
    });

  const getMemberCode = (member: Member) => {
    const memberNumber = String(
      members.filter((m) => m.plan === member.plan && m.id < member.id).length + 1
    ).padStart(2, "0");
    return `${member.plan} ${memberNumber}`;
  };

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