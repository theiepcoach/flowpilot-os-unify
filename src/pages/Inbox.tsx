import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Mail, 
  MessageSquare, 
  Instagram, 
  Facebook,
  Send,
  Sparkles,
  MoreHorizontal,
  Paperclip,
  Star,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";

type Channel = "all" | "email" | "sms" | "instagram" | "facebook";

interface Conversation {
  id: string;
  contact: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  channel: Channel;
  starred: boolean;
}

interface Message {
  id: string;
  content: string;
  time: string;
  sender: "contact" | "me";
  aiGenerated?: boolean;
}

const conversations: Conversation[] = [
  { id: "1", contact: "Sarah Johnson", initials: "SJ", lastMessage: "Thanks for the proposal! I'll review it today.", time: "2 min", unread: 2, channel: "email", starred: true },
  { id: "2", contact: "Mike Chen", initials: "MC", lastMessage: "Can we reschedule to tomorrow?", time: "15 min", unread: 1, channel: "sms", starred: false },
  { id: "3", contact: "Emily Davis", initials: "ED", lastMessage: "Love the design concepts!", time: "1 hr", unread: 0, channel: "instagram", starred: false },
  { id: "4", contact: "David Kim", initials: "DK", lastMessage: "Let's discuss the project scope.", time: "2 hrs", unread: 0, channel: "email", starred: true },
  { id: "5", contact: "Anna Martinez", initials: "AM", lastMessage: "Sent you the files you requested.", time: "3 hrs", unread: 0, channel: "facebook", starred: false },
  { id: "6", contact: "Robert Taylor", initials: "RT", lastMessage: "Looking forward to our meeting!", time: "5 hrs", unread: 0, channel: "sms", starred: false },
];

const messages: Message[] = [
  { id: "1", content: "Hi! I just received your proposal for the website redesign project.", time: "10:30 AM", sender: "contact" },
  { id: "2", content: "Thank you for putting together such a detailed document. I really appreciate the thorough breakdown of each phase.", time: "10:32 AM", sender: "contact" },
  { id: "3", content: "You're welcome, Sarah! I wanted to make sure we covered all the bases. Do you have any questions about the timeline or deliverables?", time: "10:45 AM", sender: "me" },
  { id: "4", content: "Yes, I was wondering about the SEO optimization phase. Could we potentially extend that by a week to include more comprehensive keyword research?", time: "11:00 AM", sender: "contact" },
  { id: "5", content: "Absolutely! We can adjust the timeline to include a more in-depth SEO strategy. I'll send over a revised proposal by end of day.", time: "11:15 AM", sender: "me", aiGenerated: true },
  { id: "6", content: "Thanks for the proposal! I'll review it today.", time: "2 min ago", sender: "contact" },
];

const channelIcons = {
  all: MessageSquare,
  email: Mail,
  sms: MessageSquare,
  instagram: Instagram,
  facebook: Facebook,
};

const channelColors = {
  all: "text-foreground",
  email: "text-blue-500",
  sms: "text-green-500",
  instagram: "text-pink-500",
  facebook: "text-blue-600",
};

const Inbox = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [messageInput, setMessageInput] = useState("");

  const filteredConversations = selectedChannel === "all" 
    ? conversations 
    : conversations.filter(c => c.channel === selectedChannel);

  return (
    <AppLayout title="InboxPilot">
      <div className="flex h-[calc(100vh-140px)] rounded-xl bg-card border border-border overflow-hidden shadow-md">
        {/* Left Sidebar - Channels & Conversations */}
        <div className="w-80 border-r border-border flex flex-col">
          {/* Channel Tabs */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
              {(["all", "email", "sms", "instagram", "facebook"] as Channel[]).map((channel) => {
                const Icon = channelIcons[channel];
                return (
                  <button
                    key={channel}
                    onClick={() => setSelectedChannel(channel)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all",
                      selectedChannel === channel
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline capitalize">{channel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 bg-secondary border-0" />
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conv) => {
                const ChannelIcon = channelIcons[conv.channel];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left",
                      selectedConversation.id === conv.id
                        ? "bg-accent/10 border border-accent/20"
                        : "hover:bg-secondary"
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                        {conv.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground text-sm">{conv.contact}</span>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChannelIcon className={cn("h-3.5 w-3.5 shrink-0", channelColors[conv.channel])} />
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-accent text-accent-foreground text-xs h-5 min-w-5 flex items-center justify-center">
                        {conv.unread}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {selectedConversation.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{selectedConversation.contact}</p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = channelIcons[selectedConversation.channel];
                    return <Icon className={cn("h-3.5 w-3.5", channelColors[selectedConversation.channel])} />;
                  })()}
                  <span className="text-xs text-muted-foreground capitalize">{selectedConversation.channel}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Star className={cn("h-4 w-4", selectedConversation.starred && "fill-warning text-warning")} />
              </Button>
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5",
                      msg.sender === "me"
                        ? "bg-accent text-accent-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      {msg.aiGenerated && (
                        <Sparkles className="h-3 w-3 text-accent-foreground/60" />
                      )}
                      <span className={cn(
                        "text-[10px]",
                        msg.sender === "me" ? "text-accent-foreground/60" : "text-muted-foreground"
                      )}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="pr-24"
                />
                <Button
                  variant="ghost-teal"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  AI Reply
                </Button>
              </div>
              <Button variant="teal" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Contact Info */}
        <div className="w-72 border-l border-border p-4 hidden xl:block">
          <div className="text-center mb-6">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
                {selectedConversation.initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-foreground">{selectedConversation.contact}</h3>
            <p className="text-sm text-muted-foreground">Tech Corp • Lead</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Contact Info</p>
              <div className="space-y-2">
                <p className="text-sm text-foreground">sarah@techcorp.com</p>
                <p className="text-sm text-foreground">+1 555-0101</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Lead Status</p>
              <Badge className="bg-accent/10 text-accent border-accent/20">Qualified</Badge>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Value</p>
              <p className="text-lg font-semibold text-foreground">$8,500</p>
            </div>

            <Button variant="outline" className="w-full" size="sm">
              View Full Profile
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inbox;
