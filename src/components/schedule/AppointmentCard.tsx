import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Video,
  Phone,
  MapPin,
  MoreHorizontal,
  Check,
  X,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment, useDeleteAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: Appointment;
  startHour: number;
  duration: number;
  onEdit?: (appointment: Appointment) => void;
}

const typeConfig = {
  video: { icon: Video, color: "text-blue-500", lightColor: "bg-blue-500/10 border-blue-500/20" },
  phone: { icon: Phone, color: "text-green-500", lightColor: "bg-green-500/10 border-green-500/20" },
  "in-person": { icon: MapPin, color: "text-purple-500", lightColor: "bg-purple-500/10 border-purple-500/20" },
};

export function AppointmentCard({ appointment, startHour, duration, onEdit }: AppointmentCardProps) {
  const deleteAppointment = useDeleteAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  // Determine appointment type from location field
  const getType = (): "video" | "phone" | "in-person" => {
    const loc = appointment.location?.toLowerCase() || "";
    if (loc === "video") return "video";
    if (loc === "phone") return "phone";
    return "in-person";
  };

  const type = getType();
  const config = typeConfig[type];
  const Icon = config.icon;
  const heightPercent = Math.max(duration * 60, 50);

  const contact = appointment.contact;
  const clientName = contact
    ? `${contact.first_name}${contact.last_name ? ` ${contact.last_name}` : ""}`
    : null;
  const clientInitials = clientName
    ? clientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment.mutate(appointment.id);
    }
  };

  const handleMarkCompleted = () => {
    updateStatus.mutate({ id: appointment.id, status: "completed" });
  };

  const handleMarkNoShow = () => {
    updateStatus.mutate({ id: appointment.id, status: "no_show" });
  };

  const handleCancel = () => {
    updateStatus.mutate({ id: appointment.id, status: "cancelled" });
  };

  return (
    <div
      className={cn(
        "absolute left-1 right-1 rounded-lg border p-2 transition-all duration-200 hover:shadow-md cursor-pointer group overflow-hidden",
        config.lightColor
      )}
      style={{
        top: `${(startHour - 8) * 60}px`,
        height: `${heightPercent}px`,
        minHeight: "50px",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-3.5 w-3.5", config.color)} />
          <span className="text-xs font-semibold text-foreground truncate">
            {appointment.title}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(appointment)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMarkCompleted}>
              <Check className="h-4 w-4 mr-2" />
              Mark Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkNoShow}>
              <X className="h-4 w-4 mr-2" />
              Mark No-Show
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {clientName && (
        <div className="mt-1 flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-card">
              {clientInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {clientName}
          </span>
        </div>
      )}
      
      <div className="mt-1 text-[10px] text-muted-foreground">
        {format(new Date(appointment.start_time), "h:mm a")} - {format(new Date(appointment.end_time), "h:mm a")}
      </div>
      
      {appointment.status !== "scheduled" && (
        <Badge
          variant="secondary"
          className={cn(
            "mt-1 text-[10px] h-4",
            appointment.status === "completed" && "bg-success/20 text-success",
            appointment.status === "no_show" && "bg-destructive/20 text-destructive",
            appointment.status === "cancelled" && "bg-muted text-muted-foreground"
          )}
        >
          {appointment.status.replace("_", " ")}
        </Badge>
      )}
    </div>
  );
}
