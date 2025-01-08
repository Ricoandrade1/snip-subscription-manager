import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductSale {
  name: string;
  total: number;
}

interface TopProductsChartProps {
  productSales: ProductSale[];
}

export function TopProductsChart({ productSales }: TopProductsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="min-w-[800px]">
            <BarChart
              width={800}
              height={300}
              data={productSales}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total de Vendas" fill="#22C55E" />
            </BarChart>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}