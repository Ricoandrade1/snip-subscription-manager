import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/contexts/MemberContext";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const getDueDate = (createdAt: string | undefined) => {
    if (!createdAt) return '-';
    const creationDate = new Date(createdAt);
    const dueDate = addMonths(creationDate, 1); // Due date is 1 month after creation
    return format(dueDate, 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={onClick}
    >
      <TableCell className="font-medium">{memberCode}</TableCell>
      <TableCell>{member.name}</TableCell>
      <TableCell>{member.nickname || '-'}</TableCell>
      <TableCell>
        <Badge className={`${getPlanBadgeColor(member.plan)}`}>
          {member.plan}
        </Badge>
      </TableCell>
      <TableCell>{member.phone || '-'}</TableCell>
      <TableCell>{getDueDate(member.created_at)}</TableCell>
    </TableRow>
  );
}