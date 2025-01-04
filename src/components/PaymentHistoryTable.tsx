import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Payment {
  memberName: string;
  plan: string;
  amount?: number;
  date?: string;
  dueDate?: string;
  status?: "paid" | "pending" | "overdue";
}

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Membro</TableHead>
          <TableHead>Plano</TableHead>
          {payments[0]?.amount && <TableHead>Valor</TableHead>}
          {payments[0]?.date && <TableHead>Data</TableHead>}
          {payments[0]?.dueDate && <TableHead>Vencimento</TableHead>}
          {payments[0]?.status && <TableHead>Status</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment, index) => (
          <TableRow key={index}>
            <TableCell>{payment.memberName}</TableCell>
            <TableCell>{payment.plan}</TableCell>
            {payment.amount && (
              <TableCell>{payment.amount.toLocaleString("pt-BR", { style: "currency", currency: "EUR" })}</TableCell>
            )}
            {payment.date && (
              <TableCell>
                {format(new Date(payment.date), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
            )}
            {payment.dueDate && (
              <TableCell>
                {format(new Date(payment.dueDate), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
            )}
            {payment.status && (
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === "paid"
                      ? "bg-green-500/20 text-green-500"
                      : payment.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {payment.status === "paid"
                    ? "Pago"
                    : payment.status === "pending"
                    ? "Pendente"
                    : "Atrasado"}
                </span>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}