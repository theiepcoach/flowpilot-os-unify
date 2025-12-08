import { PlaceholderPage } from "./PlaceholderPage";
import { UserCog } from "lucide-react";

const Team = () => {
  return (
    <PlaceholderPage
      title="TeamPilot"
      description="Manage your team's tasks, track performance, and streamline collaboration with our workforce command console."
      icon={UserCog}
      features={[
        "Task assignment and tracking",
        "Recurring tasks and deadlines",
        "Team performance analytics",
        "Role-based access control",
        "AI performance summaries",
      ]}
    />
  );
};

export default Team;
