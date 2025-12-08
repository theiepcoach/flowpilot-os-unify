import { PlaceholderPage } from "./PlaceholderPage";
import { Megaphone } from "lucide-react";

const Marketing = () => {
  return (
    <PlaceholderPage
      title="MarketingPilot"
      description="Create AI-powered marketing content, schedule social posts, and manage your brand presence across all channels."
      icon={Megaphone}
      features={[
        "AI-generated social media content",
        "Content calendar and scheduling",
        "Email campaign builder",
        "Brand voice training",
        "Performance analytics",
      ]}
    />
  );
};

export default Marketing;
