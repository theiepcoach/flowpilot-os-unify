import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateAutomation, TRIGGER_TYPES } from "@/hooks/useAutomations";

interface AddAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAutomationDialog({ open, onOpenChange }: AddAutomationDialogProps) {
  const createAutomation = useCreateAutomation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createAutomation.mutateAsync({
      name,
      description,
      trigger_type: triggerType,
      active: true,
    });

    onOpenChange(false);
    setName("");
    setDescription("");
    setTriggerType("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Automation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Automation name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Trigger</Label>
            <Select value={triggerType} onValueChange={setTriggerType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_TYPES.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    {trigger.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this automation do?"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="teal" disabled={createAutomation.isPending || !triggerType}>
              {createAutomation.isPending ? "Creating..." : "Create Automation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
