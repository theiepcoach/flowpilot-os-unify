import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Sparkles, Calendar, Instagram, Facebook, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

const Marketing = () => {
  const [brandVoice, setBrandVoice] = useState("");
  
  return (
    <AppLayout title="MarketingPilot">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground">Marketing Hub</h2>
        <p className="text-muted-foreground">Create AI-powered content and manage your marketing presence</p>
      </div>

      {/* Info Card */}
      <div className="rounded-xl bg-gradient-to-br from-navy to-navy-light p-6 text-primary-foreground mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold mb-2">AI Content Generation</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Train your brand voice and let AI generate social media posts, email campaigns, 
              and marketing content that matches your unique style.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Brand Voice */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Brand Voice</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Describe your brand's tone, style, and personality. This will help AI generate content that sounds like you.
          </p>
          <Textarea
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            placeholder="E.g., Professional yet friendly, uses casual language, focuses on helping small business owners..."
            className="h-32 mb-4"
          />
          <Button variant="teal">
            <Sparkles className="h-4 w-4 mr-2" />
            Save Brand Voice
          </Button>
        </div>

        {/* Content Types */}
        <div className="rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Create</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span>Instagram Post</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook Post</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <span>Email Campaign</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <span>SMS Blast</span>
            </Button>
          </div>
        </div>

        {/* Content Calendar Placeholder */}
        <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Content Calendar</h3>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Full Calendar
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="font-medium mb-2">No scheduled content yet</p>
            <p className="text-sm">Create your first post to start building your content calendar.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Marketing;
