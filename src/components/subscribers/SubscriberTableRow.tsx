import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subscriber } from "./types";
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getSubscriberCode } from "./utils/getSubscriberCode";
import { Button } from "@/components/ui/button";
import { Trash2, Phone } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SubscriberTableRowProps {
  subscriber: Subscriber;
  subscribers: Subscriber[];
  onClick: () => void;
  onDeleteClick: () => void;
}

export function SubscriberTableRow({ subscriber, subscribers, onClick, onDeleteClick }: SubscriberTableRowProps) {
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
        return "bg-green-500/20 text-green-500";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-500";
      case "cancelado":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pago: "Pago",
      pendente: "Pendente",
      cancelado: "Cancelado"
    };
    return statusMap[status] || status;
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const getNextPaymentDate = (paymentDate: string | null) => {
    if (!paymentDate) return '-';
    const nextPayment = addDays(new Date(paymentDate), 30);
    return format(nextPayment, "dd/MM/yyyy", { locale: ptBR });
  };

  const handlePhoneClick = () => {
    if (subscriber.phone) {
      navigator.clipboard.writeText(subscriber.phone);
    }
  };

  return (
    <TableRow 
      className="hover:bg-barber-gray/50 border-b border-barber-gray transition-colors cursor-pointer"
      onClick={onClick}
    >
      <TableCell className="font-medium text-barber-light whitespace-nowrap px-4">
        {getSubscriberCode(subscriber, subscribers)}
      </TableCell>
      <TableCell className="text-barber-light">
        {subscriber.name}
      </TableCell>
      <TableCell className="text-barber-light">
        {subscriber.nickname || '-'}
      </TableCell>
      <TableCell>
        <Badge 
          key={`${subscriber.id}-${subscriber.plan}`} 
          className={`${getPlanBadgeColor(subscriber.plan)} whitespace-nowrap`}
        >
          {subscriber.plan}
        </Badge>
      </TableCell>
      <TableCell className="text-barber-light">
        {subscriber.phone ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="flex items-center gap-1 hover:text-barber-gold transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePhoneClick();
                }}
              >
                <Phone className="h-4 w-4" />
                {subscriber.phone}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clique para copiar</p>
            </TooltipContent>
          </Tooltip>
        ) : '-'}
      </TableCell>
      <TableCell className="text-barber-light">
        {subscriber.nif || '-'}
      </TableCell>
      <TableCell className="text-barber-light whitespace-nowrap">
        {formatDate(subscriber.payment_date)}
      </TableCell>
      <TableCell className="text-barber-light whitespace-nowrap">
        {getNextPaymentDate(subscriber.payment_date)}
      </TableCell>
      <TableCell>
        <Badge 
          key={`${subscriber.id}-${subscriber.status}`}
          className={`${getStatusBadgeColor(subscriber.status)} whitespace-nowrap`}
        >
          {formatStatus(subscriber.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
          className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}