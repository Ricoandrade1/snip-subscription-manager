import { useMemberContext } from "@/contexts/MemberContext";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export function MonthlyRevenueChart() {
  const { members } = useMemberContext();

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, "yyyy-MM");
  }).reverse();

  const monthlyRevenue = last6Months.map((month) => {
    const revenue = members.reduce((total, member) => {
      const monthPayments = (member.paymentHistory || [])
        .filter(
          (payment) =>
            format(new Date(payment.date), "yyyy-MM") === month &&
            payment.status === "paid"
        )
        .reduce((sum, payment) => sum + payment.amount, 0);
      return total + monthPayments;
    }, 0);

    return {
      month: format(new Date(month), "MMM/yyyy", { locale: ptBR }),
      revenue,
    };
  });

  return (
    <ChartContainer className="h-[300px]" config={{}}>
      <BarChart data={monthlyRevenue}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(value) =>
            value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })
          }
        />
        <Bar dataKey="revenue" fill="#eab308" />
        <ChartTooltip />
      </BarChart>
    </ChartContainer>
  );
}