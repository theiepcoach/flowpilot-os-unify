import { PlaceholderPage } from "./PlaceholderPage";
import { Zap } from "lucide-react";

const Automations = () => {
  return (
    <PlaceholderPage
      title="AutomatePilot"
      description="Build powerful workflow automations with our visual no-code builder. Connect triggers to actions and streamline your business operations."
      icon={Zap}
      features={[
        "Visual drag-and-drop automation builder",
        "Pre-built templates for common workflows",
        "Trigger automations on lead, appointment, or payment events",
        "Connect to Make.com for advanced integrations",
        "AI-powered workflow suggestions",
      ]}
    />
  );
};

export default Automations;
