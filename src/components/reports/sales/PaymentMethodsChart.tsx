import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface PaymentMethod {
  name: string;
  value: number;
}

interface PaymentMethodsChartProps {
  paymentMethods: PaymentMethod[];
}

const COLORS = ['#FFB000', '#22C55E', '#3B82F6', '#EC4899', '#8B5CF6'];

export function PaymentMethodsChart({ paymentMethods }: PaymentMethodsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            data={paymentMethods}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {paymentMethods.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </CardContent>
    </Card>
  );
}