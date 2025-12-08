import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Video,
  Phone,
  MapPin,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

interface Appointment {
  id: string;
  title: string;
  client: string;
  clientInitials: string;
  startHour: number;
  duration: number; // in hours
  day: number; // 0-6 for Mon-Sun
  type: "video" | "phone" | "in-person";
  status: "confirmed" | "pending" | "completed";
}

const appointments: Appointment[] = [
  { id: "1", title: "Discovery Call", client: "Sarah Johnson", clientInitials: "SJ", startHour: 9, duration: 0.5, day: 0, type: "video", status: "confirmed" },
  { id: "2", title: "Project Kickoff", client: "Mike Chen", clientInitials: "MC", startHour: 11, duration: 1, day: 0, type: "video", status: "confirmed" },
  { id: "3", title: "Follow-up", client: "Emily Davis", clientInitials: "ED", startHour: 14, duration: 0.5, day: 1, type: "phone", status: "pending" },
  { id: "4", title: "Strategy Session", client: "David Kim", clientInitials: "DK", startHour: 10, duration: 1.5, day: 2, type: "video", status: "confirmed" },
  { id: "5", title: "Site Visit", client: "Anna Martinez", clientInitials: "AM", startHour: 15, duration: 2, day: 3, type: "in-person", status: "confirmed" },
  { id: "6", title: "Contract Review", client: "Robert Taylor", clientInitials: "RT", startHour: 9, duration: 1, day: 4, type: "video", status: "pending" },
];

const typeConfig = {
  video: { icon: Video, color: "bg-blue-500", lightColor: "bg-blue-500/10 border-blue-500/20" },
  phone: { icon: Phone, color: "bg-green-500", lightColor: "bg-green-500/10 border-green-500/20" },
  "in-person": { icon: MapPin, color: "bg-purple-500", lightColor: "bg-purple-500/10 border-purple-500/20" },
};

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const config = typeConfig[appointment.type];
  const Icon = config.icon;
  const heightPercent = appointment.duration * 100;

  return (
    <div
      className={cn(
        "absolute left-1 right-1 rounded-lg border p-2 transition-all duration-200 hover:shadow-md cursor-pointer group overflow-hidden",
        config.lightColor
      )}
      style={{
        top: `${(appointment.startHour - 8) * 60}px`,
        height: `${heightPercent * 0.6}px`,
        minHeight: "50px",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-3.5 w-3.5", appointment.type === "video" ? "text-blue-500" : appointment.type === "phone" ? "text-green-500" : "text-purple-500")} />
          <span className="text-xs font-semibold text-foreground truncate">
            {appointment.title}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <Avatar className="h-5 w-5">
          <AvatarFallback className="text-[10px] bg-card">
            {appointment.clientInitials}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground truncate">
          {appointment.client}
        </span>
      </div>
      {appointment.status === "pending" && (
        <Badge variant="secondary" className="mt-1 text-[10px] h-4">
          Pending
        </Badge>
      )}
    </div>
  );
}

const Schedule = () => {
  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Generate dates for the current week
  const getWeekDates = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1;
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(curr.setDate(first + i));
      return day.getDate();
    });
  };
  
  const weekDates = getWeekDates();
  const todayIndex = new Date().getDay() - 1; // 0-6, Mon-Sun

  return (
    <AppLayout title="SchedulePilot">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            {currentMonth}
          </h2>
          <Button variant="secondary" size="sm">
            Today
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="default">
            <Clock className="h-4 w-4 mr-2" />
            Set Availability
          </Button>
          <Button variant="teal" size="default">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-md">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 text-center bg-secondary/50">
            <span className="text-xs font-medium text-muted-foreground">
              GMT-5
            </span>
          </div>
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={cn(
                "p-3 text-center border-l border-border",
                index === todayIndex && "bg-accent/5"
              )}
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {day}
              </p>
              <p
                className={cn(
                  "text-lg font-semibold",
                  index === todayIndex
                    ? "text-accent"
                    : "text-foreground"
                )}
              >
                {weekDates[index]}
              </p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="relative">
          <div className="grid grid-cols-8">
            {/* Time Column */}
            <div className="bg-secondary/30">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[60px] border-b border-border flex items-start justify-end pr-3 pt-1"
                >
                  <span className="text-xs text-muted-foreground">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map((day, dayIndex) => (
              <div
                key={day}
                className={cn(
                  "relative border-l border-border",
                  dayIndex === todayIndex && "bg-accent/5"
                )}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                  />
                ))}
                
                {/* Appointments */}
                {appointments
                  .filter((apt) => apt.day === dayIndex)
                  .map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt} />
                  ))}
              </div>
            ))}
          </div>

          {/* Current Time Indicator */}
          <div
            className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
            style={{ top: `${(new Date().getHours() - 8 + new Date().getMinutes() / 60) * 60}px` }}
          >
            <div className="w-16 flex items-center justify-end pr-1">
              <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <div className="flex-1 h-0.5 bg-accent" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6">
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", config.color)} />
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">{type}</span>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Schedule;
