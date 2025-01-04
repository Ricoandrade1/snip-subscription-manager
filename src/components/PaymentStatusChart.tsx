import { useMemberContext } from "@/contexts/MemberContext";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

export function PaymentStatusChart() {
  const { members } = useMemberContext();

  const paymentStatus = members.reduce(
    (acc, member) => {
      const lastPayment = member.paymentHistory?.[0];
      if (lastPayment) {
        acc[lastPayment.status]++;
      }
      return acc;
    },
    { paid: 0, pending: 0, overdue: 0 }
  );

  const data = [
    { name: "Pago", value: paymentStatus.paid, color: "#22c55e" },
    { name: "Pendente", value: paymentStatus.pending, color: "#eab308" },
    { name: "Atrasado", value: paymentStatus.overdue, color: "#ef4444" },
  ];

  return (
    <ChartContainer className="h-[300px]" config={{}}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip />
      </PieChart>
    </ChartContainer>
  );
}