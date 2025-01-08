import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesSummaryProps {
  totalSales: number;
  totalTransactions: number;
}

export function SalesSummaryCard({ totalSales, totalTransactions }: SalesSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR'
            }).format(totalSales)}
          </p>
          <p className="text-muted-foreground">
            Total de {totalTransactions} transações
          </p>
        </div>
      </CardContent>
    </Card>
  );
}