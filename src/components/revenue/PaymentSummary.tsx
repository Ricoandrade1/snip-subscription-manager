import { Payment } from "@/contexts/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentHistoryTable } from "@/components/PaymentHistoryTable";

interface PaymentSummaryProps {
  title: string;
  payments: Payment[];
}

export function PaymentSummary({ title, payments }: PaymentSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentHistoryTable payments={payments} />
      </CardContent>
    </Card>
  );
}