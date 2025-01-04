import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";

export function Schedule() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGoogleAuth = () => {
    // Store the current URL to redirect back after auth
    localStorage.setItem('returnTo', window.location.pathname);
    
    // Redirect to Google OAuth
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/callback&response_type=token&scope=https://www.googleapis.com/auth/calendar.readonly`;
  };

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('googleCalendarToken');
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Calendar className="w-16 h-16 text-barber-gold" />
        <h2 className="text-2xl font-semibold">Conecte sua Agenda Google</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Para visualizar e gerenciar seus compromissos, conecte sua conta do Google Calendar.
        </p>
        <Button 
          onClick={handleGoogleAuth}
          className="bg-barber-gold hover:bg-barber-gold/90"
        >
          Conectar com Google Calendar
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <FullCalendar
        plugins={[dayGridPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        height="auto"
        googleCalendarApiKey={GOOGLE_API_KEY}
        eventSources={[
          {
            googleCalendarId: 'primary',
            className: 'gcal-event'
          }
        ]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia'
        }}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          toast({
            title: info.event.title,
            description: `${info.event.start?.toLocaleString()} - ${info.event.end?.toLocaleString()}`,
          });
        }}
      />
    </Card>
  );
}