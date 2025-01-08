import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SalesByDateProps {
  salesByDate: Array<{
    date: string;
    total: number;
  }>;
}

export function SalesByDateChart({ salesByDate }: SalesByDateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="min-w-[800px]">
            <BarChart
              width={800}
              height={300}
              data={salesByDate}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total de Vendas" fill="#FFB000" />
            </BarChart>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}