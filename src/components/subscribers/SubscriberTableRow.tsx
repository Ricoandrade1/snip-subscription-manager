import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subscriber } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SubscriberTableRowProps {
  subscriber: Subscriber;
  onClick: () => void;
}

export function SubscriberTableRow({ subscriber, onClick }: SubscriberTableRowProps) {
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-500 hover:bg-blue-600";
      case "Classic":
        return "bg-purple-500 hover:bg-purple-600";
      case "Business":
        return "bg-barber-gold hover:bg-barber-gold/90";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "overdue":
        return "bg-red-500 hover:bg-red-600";
      case "cancelled":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Pago";
      case "overdue":
        return "Atrasado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-barber-gray/50 border-b border-barber-gray transition-colors"
      onClick={onClick}
    >
      <TableCell className="font-medium text-barber-light">{subscriber.name}</TableCell>
      <TableCell className="text-barber-light">{subscriber.nickname || '-'}</TableCell>
      <TableCell>
        <Badge className={`${getPlanBadgeColor(subscriber.plan)}`}>
          {subscriber.plan}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusBadgeColor(subscriber.status)}`}>
          {getStatusLabel(subscriber.status)}
        </Badge>
      </TableCell>
      <TableCell className="text-barber-light">{subscriber.phone || '-'}</TableCell>
      <TableCell className="text-barber-light">
        {subscriber.payment_date 
          ? format(new Date(subscriber.payment_date), "dd/MM/yyyy", { locale: ptBR })
          : '-'}
      </TableCell>
    </TableRow>
  );
}