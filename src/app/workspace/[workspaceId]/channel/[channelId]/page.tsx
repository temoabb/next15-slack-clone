"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";

// The page will share 'workspaceId' route's layout

function ChannelIdPage() {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  return <div className="p-2">Channel Id: {channelId} </div>;
}

export default ChannelIdPage;
