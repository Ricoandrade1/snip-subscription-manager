import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRange } from "react-day-picker";

interface SaleData {
  date: string;
  total: number;
  payment_method: string;
  items: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

interface PaymentMethod {
  name: string;
  value: number;
}

interface ProductSale {
  name: string;
  total: number;
}

const COLORS = ['#FFB000', '#22C55E', '#3B82F6', '#EC4899', '#8B5CF6'];

export function SalesReport() {
  const [dateRange, setDateRange] = useState<Required<DateRange>>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [period, setPeriod] = useState("daily");

  const { data: salesData, isLoading } = useQuery({
    queryKey: ["sales-report", dateRange, period],
    queryFn: async () => {
      try {
        const { data: sales, error: salesError } = await supabase
          .from("sales")
          .select(`
            id,
            total,
            payment_method,
            created_at,
            sale_items (
              quantity,
              price,
              products (
                name
              )
            )
          `)
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString())
          .order('created_at', { ascending: true });

        if (salesError) throw salesError;

        // Processar dados para gráficos
        const salesByDate = new Map<string, number>();
        const paymentMethods = new Map<string, number>();
        const productSales = new Map<string, number>();

        sales?.forEach((sale) => {
          // Agrupar por data
          const date = format(new Date(sale.created_at), 'dd/MM/yyyy');
          salesByDate.set(date, (salesByDate.get(date) || 0) + sale.total);

          // Agrupar por método de pagamento
          paymentMethods.set(
            sale.payment_method,
            (paymentMethods.get(sale.payment_method) || 0) + sale.total
          );

          // Agrupar por produto
          sale.sale_items?.forEach((item) => {
            const productName = item.products?.name || 'Produto Desconhecido';
            productSales.set(
              productName,
              (productSales.get(productName) || 0) + (item.quantity * item.price)
            );
          });
        });

        return {
          salesByDate: Array.from(salesByDate.entries()).map(([date, total]) => ({
            date,
            total,
          })),
          paymentMethods: Array.from(paymentMethods.entries()).map(([method, total]) => ({
            name: method,
            value: total,
          })) as PaymentMethod[],
          productSales: Array.from(productSales.entries())
            .map(([name, total]) => ({
              name,
              total,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5) as ProductSale[],
          totalSales: sales?.reduce((acc, sale) => acc + sale.total, 0) || 0,
          totalTransactions: sales?.length || 0,
        };
      } catch (error) {
        console.error("Error fetching sales data:", error);
        toast.error("Erro ao carregar dados de vendas");
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum dado encontrado para o período selecionado
      </div>
    );
  }

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange?.from && newDateRange?.to) {
      setDateRange({ from: newDateRange.from, to: newDateRange.to });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="space-y-2 flex-1">
          <Label>Período de Análise</Label>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={handleDateRangeChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Agrupamento</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                }).format(salesData.totalSales)}
              </p>
              <p className="text-muted-foreground">
                Total de {salesData.totalTransactions} transações
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={300} height={300}>
              <Pie
                data={salesData.paymentMethods}
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
                {salesData.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendas por Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <BarChart
              width={800}
              height={300}
              data={salesData.salesByDate}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total de Vendas" fill="#FFB000" />
            </BarChart>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <BarChart
              width={800}
              height={300}
              data={salesData.productSales}
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}