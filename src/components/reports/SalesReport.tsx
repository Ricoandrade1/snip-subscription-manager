import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { SalesSummaryCard } from "./sales/SalesSummaryCard";
import { PaymentMethodsChart } from "./sales/PaymentMethodsChart";
import { SalesByDateChart } from "./sales/SalesByDateChart";
import { TopProductsChart } from "./sales/TopProductsChart";
import { SalesFilters } from "./sales/SalesFilters";

interface SaleItem {
  quantity: number;
  price: number;
  products: {
    name: string;
  } | null;
}

interface Sale {
  id: string;
  total: number;
  payment_method: string;
  created_at: string;
  sale_items: SaleItem[] | null;
}

interface SalesData {
  salesByDate: Array<{ date: string; total: number }>;
  paymentMethods: Array<{ name: string; value: number }>;
  productSales: Array<{ name: string; total: number }>;
  totalSales: number;
  totalTransactions: number;
}

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

        const salesByDate = new Map<string, number>();
        const paymentMethods = new Map<string, number>();
        const productSales = new Map<string, number>();

        (sales as Sale[])?.forEach((sale) => {
          const date = new Date(sale.created_at).toLocaleDateString('pt-PT');
          salesByDate.set(date, (salesByDate.get(date) || 0) + sale.total);
          
          paymentMethods.set(
            sale.payment_method,
            (paymentMethods.get(sale.payment_method) || 0) + sale.total
          );

          sale.sale_items?.forEach((item) => {
            const productName = item.products?.name || 'Produto Desconhecido';
            productSales.set(
              productName,
              (productSales.get(productName) || 0) + (item.quantity * item.price)
            );
          });
        });

        const result: SalesData = {
          salesByDate: Array.from(salesByDate.entries()).map(([date, total]) => ({
            date,
            total,
          })),
          paymentMethods: Array.from(paymentMethods.entries()).map(([name, value]) => ({
            name,
            value,
          })),
          productSales: Array.from(productSales.entries())
            .map(([name, total]) => ({
              name,
              total,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5),
          totalSales: sales?.reduce((acc, sale) => acc + sale.total, 0) || 0,
          totalTransactions: sales?.length || 0,
        };

        return result;
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
      <SalesFilters
        dateRange={dateRange}
        onDateChange={handleDateRangeChange}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SalesSummaryCard
          totalSales={salesData.totalSales}
          totalTransactions={salesData.totalTransactions}
        />
        <PaymentMethodsChart paymentMethods={salesData.paymentMethods} />
      </div>

      <SalesByDateChart salesByDate={salesData.salesByDate} />
      <TopProductsChart productSales={salesData.productSales} />
    </div>
  );
}