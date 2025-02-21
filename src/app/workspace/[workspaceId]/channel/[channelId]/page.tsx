"use client";

import { Loader, TriangleAlert } from "lucide-react";

import { Header } from "./header";
import ChatInput from "./chat-input";

import { useChannelId } from "@/hooks/use-channel-id";
import { MessageList } from "@/components/message-list";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

function ChannelIdPage() {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  const { results, status, loadMore } = useGetMessages({ channelId });

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-1 justify-center items-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-1 flex-col gap-y-2 justify-center items-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
}

export default ChannelIdPage;

// The page will share [workspaceId] route's layout.
