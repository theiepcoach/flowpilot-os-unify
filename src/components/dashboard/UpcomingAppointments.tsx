import { Video, Phone, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Appointment {
  id: string;
  title: string;
  client: string;
  clientInitials: string;
  time: string;
  duration: string;
  type: "video" | "phone" | "in-person";
}

const appointments: Appointment[] = [
  {
    id: "1",
    title: "Discovery Call",
    client: "Sarah Johnson",
    clientInitials: "SJ",
    time: "10:00 AM",
    duration: "30 min",
    type: "video",
  },
  {
    id: "2",
    title: "Project Review",
    client: "Mike Chen",
    clientInitials: "MC",
    time: "2:00 PM",
    duration: "1 hour",
    type: "video",
  },
  {
    id: "3",
    title: "Follow-up Call",
    client: "Emily Davis",
    clientInitials: "ED",
    time: "4:30 PM",
    duration: "15 min",
    type: "phone",
  },
];

const typeConfig = {
  video: { icon: Video, label: "Video call", color: "text-blue-500" },
  phone: { icon: Phone, label: "Phone call", color: "text-green-500" },
  "in-person": { icon: MapPin, label: "In person", color: "text-purple-500" },
};

export function UpcomingAppointments() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Today's Appointments
        </h3>
        <Button variant="ghost-teal" size="sm">
          View calendar
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((apt, index) => {
          const config = typeConfig[apt.type];
          const Icon = config.icon;

          return (
            <div
              key={apt.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-sm animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                  {apt.clientInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{apt.title}</p>
                <p className="text-sm text-muted-foreground">{apt.client}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{apt.time}</span>
                </div>
                <div className={cn("flex items-center gap-1.5", config.color)}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{apt.duration}</span>
                </div>
              </div>

              <Button variant="teal" size="sm">
                Join
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
