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
        return "bg-blue-500";
      case "Classic":
        return "bg-purple-500";
      case "Business":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatus = () => {
    if (!member.payment_date) return { label: "Pendente", color: "bg-yellow-500" };
    
    const paymentDate = new Date(member.payment_date);
    const today = new Date();
    
    if (paymentDate < today) {
      return { label: "Atrasado", color: "bg-red-500" };
    }
    return { label: "Em dia", color: "bg-green-500" };
  };

  const status = getPaymentStatus();

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={onClick}
    >
      <TableCell className="font-medium">{memberCode}</TableCell>
      <TableCell>{member.name}</TableCell>
      <TableCell>{member.nickname || '-'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge className={`${getPlanBadgeColor(member.plan)}`}>
            {member.plan}
          </Badge>
        </div>
      </TableCell>
      <TableCell>{member.phone || '-'}</TableCell>
      <TableCell>
        {member.payment_date 
          ? format(new Date(member.payment_date), "dd/MM/yyyy", { locale: ptBR })
          : '-'}
      </TableCell>
      <TableCell>
        <Badge className={status.color}>
          {status.label}
        </Badge>
      </TableCell>
    </TableRow>
  );
}