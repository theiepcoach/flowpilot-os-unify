import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Video,
  Phone,
  MapPin,
  Clock,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentCard } from "@/components/schedule/AppointmentCard";
import { AddAppointmentDialog } from "@/components/schedule/AddAppointmentDialog";
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, isSameDay, getHours, differenceInMinutes } from "date-fns";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const typeConfig = {
  video: { icon: Video, color: "bg-blue-500" },
  phone: { icon: Phone, color: "bg-green-500" },
  "in-person": { icon: MapPin, color: "bg-purple-500" },
};

const Schedule = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHour, setSelectedHour] = useState<number | undefined>();

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  const { data: appointments, isLoading } = useAppointments(currentWeekStart, weekEnd);

  // Generate dates for the week
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [currentWeekStart]);

  const today = new Date();
  const todayIndex = weekDates.findIndex(d => isSameDay(d, today));

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleCellClick = (date: Date, hour: number) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setDialogOpen(true);
  };

  const handleNewAppointment = () => {
    setSelectedDate(undefined);
    setSelectedHour(undefined);
    setDialogOpen(true);
  };

  // Get appointments for a specific day
  const getAppointmentsForDay = (dayIndex: number) => {
    if (!appointments) return [];
    const dayDate = weekDates[dayIndex];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return isSameDay(aptDate, dayDate);
    }).map(apt => {
      const start = new Date(apt.start_time);
      const end = new Date(apt.end_time);
      const startHour = getHours(start) + start.getMinutes() / 60;
      const duration = differenceInMinutes(end, start) / 60;
      return { ...apt, startHour, duration };
    });
  };

  return (
    <AppLayout title="SchedulePilot">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            {format(currentWeekStart, "MMMM yyyy")}
          </h2>
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="default">
            <Clock className="h-4 w-4 mr-2" />
            Set Availability
          </Button>
          <Button variant="teal" size="default" onClick={handleNewAppointment}>
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
                {format(weekDates[index], "d")}
              </p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
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
                      onClick={() => handleCellClick(weekDates[dayIndex], hour)}
                    />
                  ))}
                  
                  {/* Appointments */}
                  {getAppointmentsForDay(dayIndex).map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      startHour={apt.startHour}
                      duration={apt.duration}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Current Time Indicator */}
            {todayIndex >= 0 && (
              <div
                className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
                style={{ top: `${(new Date().getHours() - 8 + new Date().getMinutes() / 60) * 60}px` }}
              >
                <div className="w-16 flex items-center justify-end pr-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>
                <div className="flex-1 h-0.5 bg-accent" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6">
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", config.color)} />
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">{type.replace("-", " ")}</span>
            </div>
          );
        })}
      </div>

      {/* Add Appointment Dialog */}
      <AddAppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultDate={selectedDate}
        defaultHour={selectedHour}
      />
    </AppLayout>
  );
};

export default Schedule;
