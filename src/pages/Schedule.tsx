import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments] = useState([
    {
      id: 1,
      title: "Corte de Cabelo",
      client: "João Silva",
      time: "09:00",
      duration: "30min",
    },
    {
      id: 2,
      title: "Barba",
      client: "Pedro Santos",
      time: "10:00",
      duration: "20min",
    },
    {
      id: 3,
      title: "Corte + Barba",
      client: "Carlos Oliveira",
      time: "11:00",
      duration: "50min",
    },
  ]);

  const selectedDateAppointments = appointments.filter(
    (appointment) => date?.toDateString() === new Date().toDateString()
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Agendamentos do Dia</CardTitle>
          <span className="text-sm text-muted-foreground">
            {date?.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </CardHeader>
        <Separator />
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col space-y-1 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{appointment.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {appointment.time} ({appointment.duration})
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Cliente: {appointment.client}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhum agendamento para este dia
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}