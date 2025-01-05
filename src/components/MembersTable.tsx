import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useMemberContext } from "@/contexts/MemberContext";
import { useState } from "react";
import type { Member } from "@/contexts/MemberContext";
import { EditMemberDialog } from "./EditMemberDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface MembersTableProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

interface FilterState {
  name: string;
  phone: string;
  nif: string;
  birthDate: string;
  iban: string;
}

export function MembersTable({ planFilter }: MembersTableProps) {
  const { members, isLoading } = useMemberContext();
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    birthDate: "",
    iban: "",
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
      const matchPhone = member.phone.toLowerCase().includes(filters.phone.toLowerCase());
      const matchNif = !filters.nif || (member.nif && member.nif.toLowerCase().includes(filters.nif.toLowerCase()));
      const matchBirthDate = !filters.birthDate || (member.birthDate && member.birthDate.includes(filters.birthDate));
      const matchIban = !filters.iban || (member.iban && member.iban.toLowerCase().includes(filters.iban.toLowerCase()));

      return matchName && matchPhone && matchNif && matchBirthDate && matchIban;
    })
    .sort((a, b) => {
      const aCode = getMemberCode(a);
      const bCode = getMemberCode(b);
      return aCode.localeCompare(bCode);
    });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-500";
      case "Classic":
        return "bg-purple-500";
      case "Business":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="name-filter">Nome</Label>
          <Input
            id="name-filter"
            placeholder="Filtrar por nome..."
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone-filter">Telefone</Label>
          <Input
            id="phone-filter"
            placeholder="Filtrar por telefone..."
            value={filters.phone}
            onChange={(e) => handleFilterChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nif-filter">NIF</Label>
          <Input
            id="nif-filter"
            placeholder="Filtrar por NIF..."
            value={filters.nif}
            onChange={(e) => handleFilterChange('nif', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth-date-filter">Data de Nascimento</Label>
          <Input
            id="birth-date-filter"
            type="date"
            value={filters.birthDate}
            onChange={(e) => handleFilterChange('birthDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="iban-filter">IBAN</Label>
          <Input
            id="iban-filter"
            placeholder="Filtrar por IBAN..."
            value={filters.iban}
            onChange={(e) => handleFilterChange('iban', e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>NIF</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead>IBAN</TableHead>
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
              <TableCell>
                <Badge className={`${getPlanBadgeColor(member.plan)}`}>
                  {member.plan}
                </Badge>
              </TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.nif}</TableCell>
              <TableCell>
                {member.birthDate ? format(new Date(member.birthDate), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
              </TableCell>
              <TableCell>{member.bank}</TableCell>
              <TableCell>{member.iban}</TableCell>
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