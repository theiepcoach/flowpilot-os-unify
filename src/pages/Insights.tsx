import { PlaceholderPage } from "./PlaceholderPage";
import { BarChart3 } from "lucide-react";

const Insights = () => {
  return (
    <PlaceholderPage
      title="InsightPilot"
      description="Get AI-powered insights and automated reports on your business performance. Track KPIs and make data-driven decisions."
      icon={BarChart3}
      features={[
        "Automated weekly and monthly reports",
        "KPI tracking and trend analysis",
        "AI-powered business insights",
        "Exportable PDF reports",
        "Custom dashboard builder",
      ]}
    />
  );
};

export default Insights;
