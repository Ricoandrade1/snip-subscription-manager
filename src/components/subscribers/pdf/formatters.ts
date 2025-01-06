import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Subscriber } from "../types";

export const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    cancelado: "Cancelado"
  };
  return statusMap[status] || status;
};

export const formatDate = (date: string | null | undefined) => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const calculateNextPaymentDate = (paymentDate: string | null | undefined) => {
  if (!paymentDate) return '-';
  const date = new Date(paymentDate);
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return format(nextDate, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatSubscriberData = (subscriber: Subscriber) => [
  subscriber.name || '-',
  subscriber.phone || '-',
  subscriber.nif || '-',
  subscriber.plan || '-',
  formatDate(subscriber.payment_date),
  calculateNextPaymentDate(subscriber.payment_date),
  formatStatus(subscriber.status)
];