import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { Loader2, Video, Phone, MapPin } from "lucide-react";

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultHour?: number;
}

export function AddAppointmentDialog({
  open,
  onOpenChange,
  defaultDate,
  defaultHour,
}: AddAppointmentDialogProps) {
  const createAppointment = useCreateAppointment();
  
  const getDefaultDate = () => {
    const d = defaultDate || new Date();
    return d.toISOString().split("T")[0];
  };

  const getDefaultTime = () => {
    if (defaultHour !== undefined) {
      return `${defaultHour.toString().padStart(2, "0")}:00`;
    }
    return "09:00";
  };

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getDefaultDate());
  const [startTime, setStartTime] = useState(getDefaultTime());
  const [endTime, setEndTime] = useState(() => {
    const hour = defaultHour !== undefined ? defaultHour + 1 : 10;
    return `${hour.toString().padStart(2, "0")}:00`;
  });
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [appointmentType, setAppointmentType] = useState<"video" | "phone" | "in-person">("video");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    await createAppointment.mutateAsync({
      title,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      location: appointmentType === "in-person" ? location : appointmentType,
      description,
      status: "scheduled",
    });

    // Reset form
    setTitle("");
    setDate(getDefaultDate());
    setStartTime(getDefaultTime());
    setEndTime("10:00");
    setLocation("");
    setDescription("");
    setAppointmentType("video");
    onOpenChange(false);
  };

  const typeOptions = [
    { value: "video", label: "Video Call", icon: Video },
    { value: "phone", label: "Phone Call", icon: Phone },
    { value: "in-person", label: "In Person", icon: MapPin },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading">New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Discovery Call"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={appointmentType === value ? "teal" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => setAppointmentType(value)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End *</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {appointmentType === "in-person" && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter address or location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add any notes or agenda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="teal"
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
