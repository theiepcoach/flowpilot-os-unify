import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Send, ExternalLink } from "lucide-react";
import { useWebhookSettings, useUpsertWebhookSetting, useTestWebhook, EVENT_TYPES } from "@/hooks/useWebhookSettings";

export const WebhookSettings = () => {
  const { data: settings = [], isLoading } = useWebhookSettings();
  const upsertSetting = useUpsertWebhookSetting();
  const testWebhook = useTestWebhook();

  const [localSettings, setLocalSettings] = useState<Record<string, { url: string; enabled: boolean }>>({});

  useEffect(() => {
    const initial: Record<string, { url: string; enabled: boolean }> = {};
    EVENT_TYPES.forEach(({ key }) => {
      const existing = settings.find((s) => s.event_type === key);
      initial[key] = {
        url: existing?.webhook_url || "",
        enabled: existing?.enabled ?? true,
      };
    });
    setLocalSettings(initial);
  }, [settings]);

  const handleSave = (eventType: string) => {
    const setting = localSettings[eventType];
    if (setting) {
      upsertSetting.mutate({
        event_type: eventType,
        webhook_url: setting.url,
        enabled: setting.enabled,
      });
    }
  };

  const handleTest = (eventType: string) => {
    const setting = localSettings[eventType];
    if (setting?.url) {
      testWebhook.mutate({ event_type: eventType, webhook_url: setting.url });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ExternalLink className="h-4 w-4" />
        <span>
          Connect your Make.com scenarios to receive real-time events from FlowPilot OS.
        </span>
      </div>

      {EVENT_TYPES.map(({ key, label, description }) => {
        const setting = localSettings[key] || { url: "", enabled: true };

        return (
          <Card key={key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <CardDescription className="text-sm">{description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enabled-${key}`} className="text-sm text-muted-foreground">
                    Enabled
                  </Label>
                  <Switch
                    id={`enabled-${key}`}
                    checked={setting.enabled}
                    onCheckedChange={(enabled) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], enabled },
                      }))
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="https://hook.make.com/..."
                  value={setting.url}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], url: e.target.value },
                    }))
                  }
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleTest(key)}
                  disabled={!setting.url || testWebhook.isPending}
                  title="Send test webhook"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="teal"
                  onClick={() => handleSave(key)}
                  disabled={upsertSetting.isPending}
                >
                  {upsertSetting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
