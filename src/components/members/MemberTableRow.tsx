import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/contexts/MemberContext";
import { format } from "date-fns";
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
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      case "Classic":
        return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30";
      case "Business":
        return "bg-barber-gold/20 text-barber-gold hover:bg-barber-gold/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-barber-gray/50 transition-colors border-b border-barber-gray"
      onClick={onClick}
    >
      <TableCell className="font-medium text-barber-light">{memberCode}</TableCell>
      <TableCell className="text-barber-light">{member.name}</TableCell>
      <TableCell className="text-barber-light">{member.nickname || '-'}</TableCell>
      <TableCell>
        <Badge className={`${getPlanBadgeColor(member.plan)}`}>
          {member.plan}
        </Badge>
      </TableCell>
      <TableCell className="text-barber-light">{member.phone || '-'}</TableCell>
      <TableCell className="text-barber-light">
        {member.payment_date 
          ? format(new Date(member.payment_date), "dd/MM/yyyy", { locale: ptBR })
          : '-'}
      </TableCell>
      <TableCell className="text-barber-light">
        {member.payment_date 
          ? format(new Date(member.payment_date).setMonth(new Date(member.payment_date).getMonth() + 1), "dd/MM/yyyy", { locale: ptBR })
          : '-'}
      </TableCell>
    </TableRow>
  );
}