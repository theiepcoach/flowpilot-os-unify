import { PlaceholderPage } from "./PlaceholderPage";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <PlaceholderPage
      title="Settings"
      description="Configure your FlowPilot OS workspace. Manage integrations, team access, and customize your experience."
      icon={SettingsIcon}
      features={[
        "Business profile settings",
        "Team member management",
        "Integration connections (Make.com, Twilio, etc.)",
        "Notification preferences",
        "Billing and subscription",
      ]}
    />
  );
};

export default Settings;
