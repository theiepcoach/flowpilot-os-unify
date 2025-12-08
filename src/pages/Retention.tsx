import { PlaceholderPage } from "./PlaceholderPage";
import { Heart } from "lucide-react";

const Retention = () => {
  return (
    <PlaceholderPage
      title="RetainPilot"
      description="Keep customers engaged with automated review requests, loyalty programs, and win-back campaigns."
      icon={Heart}
      features={[
        "Automated review request workflows",
        "Customer lifetime value tracking",
        "Satisfaction check-ins",
        "Referral campaign automation",
        "Win-back sequences for inactive customers",
      ]}
    />
  );
};

export default Retention;
