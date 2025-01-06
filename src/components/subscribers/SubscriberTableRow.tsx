import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subscriber } from "./types";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSubscriberCode } from "./utils/getSubscriberCode";

interface SubscriberTableRowProps {
  subscriber: Subscriber;
  subscribers: Subscriber[];
  onClick: () => void;
}

export function SubscriberTableRow({ subscriber, subscribers, onClick }: SubscriberTableRowProps) {
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pago":
      case "active":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
      case "cancelado":
      case "inactive":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };

  const normalizeStatus = (status: string) => {
    switch (status) {
      case "active":
        return "pago";
      case "inactive":
        return "cancelado";
      default:
        return status;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const getNextPaymentDate = (paymentDate: string | null, status: string) => {
    if (!paymentDate || status === 'cancelado' || status === 'inactive') return '-';
    const nextPayment = addDays(new Date(paymentDate), 30);
    return format(nextPayment, "dd/MM/yyyy", { locale: ptBR });
  };

  const normalizedStatus = normalizeStatus(subscriber.status);

  return (
    <TableRow 
      className="cursor-pointer hover:bg-barber-gray/50 border-b border-barber-gray transition-colors"
      onClick={onClick}
    >
      <TableCell className="font-medium text-barber-light whitespace-nowrap px-4">
        {getSubscriberCode(subscriber, subscribers)}
      </TableCell>
      <TableCell className="text-barber-light">{subscriber.name}</TableCell>
      <TableCell className="text-barber-light">{subscriber.nickname || '-'}</TableCell>
      <TableCell>
        <Badge className={`${getPlanBadgeColor(subscriber.plan)} whitespace-nowrap`}>
          {subscriber.plan}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusBadgeColor(subscriber.status)} whitespace-nowrap`}>
          {normalizedStatus}
        </Badge>
      </TableCell>
      <TableCell className="text-barber-light whitespace-nowrap">{subscriber.phone || '-'}</TableCell>
      <TableCell className="text-barber-light whitespace-nowrap">
        {formatDate(subscriber.payment_date)}
      </TableCell>
      <TableCell className="text-barber-light whitespace-nowrap">
        {getNextPaymentDate(subscriber.payment_date, normalizedStatus)}
      </TableCell>
    </TableRow>
  );
}