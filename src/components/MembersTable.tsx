import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useMemberContext } from "@/contexts/MemberContext";
import { useState } from "react";
import type { Member } from "@/contexts/MemberContext";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members } = useMemberContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members
    .filter((member) => !planFilter || member.plan === planFilter)
    .filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Pesquisar por nome ou apelido..."
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
            <TableHead>Plano</TableHead>
            <TableHead>Data de Débito</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{getMemberCode(member)}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.nickname}</TableCell>
              <TableCell>{member.plan}</TableCell>
              <TableCell>{member.debitDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}