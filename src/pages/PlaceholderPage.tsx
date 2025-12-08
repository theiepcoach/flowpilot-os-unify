import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

export function PlaceholderPage({ title, description, icon: Icon, features }: PlaceholderPageProps) {
  return (
    <AppLayout title={title}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 mb-6">
          <Icon className="h-10 w-10 text-accent" />
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
          {title}
        </h2>
        
        <p className="text-muted-foreground max-w-md mb-8">
          {description}
        </p>

        <div className="grid gap-3 mb-8 text-left">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              {feature}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
          <Construction className="h-4 w-4" />
          <span>Module under development</span>
        </div>
      </div>
    </AppLayout>
  );
}
