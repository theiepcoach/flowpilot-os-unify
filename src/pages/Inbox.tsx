import { useState, useMemo } from "react";
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
  Archive,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversations, useCreateMessage, MessageChannel } from "@/hooks/useMessages";
import { format, formatDistanceToNow } from "date-fns";

type Channel = "all" | MessageChannel;

const channelIcons: Record<string, typeof MessageSquare> = {
  all: MessageSquare,
  email: Mail,
  sms: MessageSquare,
  instagram: Instagram,
  facebook: Facebook,
};

const channelColors: Record<string, string> = {
  all: "text-foreground",
  email: "text-blue-500",
  sms: "text-green-500",
  instagram: "text-pink-500",
  facebook: "text-blue-600",
};

const Inbox = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("all");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  
  const { conversations, isLoading } = useConversations();
  const createMessage = useCreateMessage();

  const filteredConversations = useMemo(() => {
    if (selectedChannel === "all") return conversations;
    return conversations.filter((c) => c.lastMessage.channel === selectedChannel);
  }, [conversations, selectedChannel]);

  const selectedConversation = useMemo(() => {
    if (!selectedContactId && filteredConversations.length > 0) {
      return filteredConversations[0];
    }
    return filteredConversations.find((c) => c.contact.id === selectedContactId) || filteredConversations[0];
  }, [filteredConversations, selectedContactId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    await createMessage.mutateAsync({
      contact_id: selectedConversation.contact.id,
      message_body: messageInput,
      channel: selectedConversation.lastMessage.channel,
      direction: "sent",
    });

    setMessageInput("");
  };

  if (isLoading) {
    return (
      <AppLayout title="InboxPilot">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const sortedMessages = selectedConversation?.messages
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || [];

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
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => {
                  const ChannelIcon = channelIcons[conv.lastMessage.channel];
                  const initials = `${conv.contact.first_name[0]}${conv.contact.last_name?.[0] || ""}`;
                  
                  return (
                    <button
                      key={conv.contact.id}
                      onClick={() => setSelectedContactId(conv.contact.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left",
                        selectedConversation?.contact.id === conv.contact.id
                          ? "bg-accent/10 border border-accent/20"
                          : "hover:bg-secondary"
                      )}
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground text-sm">
                            {conv.contact.first_name} {conv.contact.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: false })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChannelIcon className={cn("h-3.5 w-3.5 shrink-0", channelColors[conv.lastMessage.channel])} />
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.message_body}</p>
                        </div>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-accent text-accent-foreground text-xs h-5 min-w-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No conversations yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {selectedConversation.contact.first_name[0]}{selectedConversation.contact.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedConversation.contact.first_name} {selectedConversation.contact.last_name}
                  </p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = channelIcons[selectedConversation.lastMessage.channel];
                      return <Icon className={cn("h-3.5 w-3.5", channelColors[selectedConversation.lastMessage.channel])} />;
                    })()}
                    <span className="text-xs text-muted-foreground capitalize">{selectedConversation.lastMessage.channel}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
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
                {sortedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.direction === "sent" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5",
                        msg.direction === "sent"
                          ? "bg-accent text-accent-foreground rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{msg.message_body}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-1">
                        {msg.ai_generated && (
                          <Sparkles className="h-3 w-3 text-accent-foreground/60" />
                        )}
                        <span className={cn(
                          "text-[10px]",
                          msg.direction === "sent" ? "text-accent-foreground/60" : "text-muted-foreground"
                        )}>
                          {format(new Date(msg.created_at), "h:mm a")}
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
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
                <Button variant="teal" size="icon" onClick={handleSendMessage} disabled={createMessage.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}

        {/* Right Sidebar - Contact Info */}
        {selectedConversation && (
          <div className="w-72 border-l border-border p-4 hidden xl:block">
            <div className="text-center mb-6">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
                  {selectedConversation.contact.first_name[0]}{selectedConversation.contact.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-foreground">
                {selectedConversation.contact.first_name} {selectedConversation.contact.last_name}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Contact Info</p>
                <div className="space-y-2">
                  {selectedConversation.contact.email && (
                    <p className="text-sm text-foreground">{selectedConversation.contact.email}</p>
                  )}
                  {selectedConversation.contact.phone && (
                    <p className="text-sm text-foreground">{selectedConversation.contact.phone}</p>
                  )}
                </div>
              </div>

              {selectedConversation.contact.lifetime_value && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Lifetime Value</p>
                  <p className="text-lg font-semibold text-foreground">
                    ${selectedConversation.contact.lifetime_value.toLocaleString()}
                  </p>
                </div>
              )}

              <Button variant="outline" className="w-full" size="sm">
                View Full Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Inbox;
