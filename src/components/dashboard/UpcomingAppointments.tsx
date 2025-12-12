import { Video, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppointments } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const typeConfig = {
  video: { icon: Video, label: "Video call", color: "text-blue-500" },
  phone: { icon: Phone, label: "Phone call", color: "text-green-500" },
  "in-person": { icon: MapPin, label: "In person", color: "text-purple-500" },
};

export function UpcomingAppointments() {
  const { data: appointments, isLoading } = useAppointments();
  const navigate = useNavigate();

  // Filter to today's appointments
  const today = new Date().toDateString();
  const todayAppointments = appointments?.filter(
    (apt) => new Date(apt.start_time).toDateString() === today && apt.status === "scheduled"
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-md flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getAppointmentType = (location: string | null): keyof typeof typeConfig => {
    if (!location) return "phone";
    const loc = location.toLowerCase();
    if (loc.includes("zoom") || loc.includes("meet") || loc.includes("video")) return "video";
    if (loc.includes("phone") || loc.includes("call")) return "phone";
    return "in-person";
  };

  const getInitials = (title: string) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins >= 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${diffMins} min`;
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Today's Appointments
        </h3>
        <Button variant="ghost-teal" size="sm" onClick={() => navigate("/schedule")}>
          View calendar
        </Button>
      </div>

      {todayAppointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No appointments scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayAppointments.map((apt, index) => {
            const type = getAppointmentType(apt.location);
            const config = typeConfig[type];
            const Icon = config.icon;

            return (
              <div
                key={apt.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-sm animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                    {getInitials(apt.title)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{apt.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {apt.description || apt.location || "No details"}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(apt.start_time), "h:mm a")}</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5", config.color)}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {getDuration(apt.start_time, apt.end_time)}
                    </span>
                  </div>
                </div>

                <Button variant="teal" size="sm">
                  Join
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
