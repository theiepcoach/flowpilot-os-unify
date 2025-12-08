import { PlaceholderPage } from "./PlaceholderPage";
import { FileText } from "lucide-react";

const Proposals = () => {
  return (
    <PlaceholderPage
      title="ProposalPilot"
      description="Create stunning proposals and quotes with AI assistance. Track engagement and collect e-signatures seamlessly."
      icon={FileText}
      features={[
        "AI-generated proposals and quotes",
        "Customizable templates",
        "Real-time engagement analytics",
        "Integrated e-signature collection",
        "Automatic follow-up reminders",
      ]}
    />
  );
};

export default Proposals;
