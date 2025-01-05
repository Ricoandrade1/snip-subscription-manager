import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Member } from "@/contexts/MemberContext";

interface MemberTableRowProps {
  member: Member;
  memberCode: string;
  onClick: () => void;
}

export function MemberTableRow({ member, memberCode, onClick }: MemberTableRowProps) {
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

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={onClick}
    >
      <TableCell className="font-medium">{memberCode}</TableCell>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Badge className={`${getPlanBadgeColor(member.plan)}`}>
          {member.plan}
        </Badge>
      </TableCell>
      <TableCell>{member.phone}</TableCell>
      <TableCell>{member.nif || '-'}</TableCell>
      <TableCell>
        {member.birthDate ? format(new Date(member.birthDate), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
      </TableCell>
      <TableCell>{member.bank || '-'}</TableCell>
      <TableCell>{member.iban || '-'}</TableCell>
    </TableRow>
  );
}