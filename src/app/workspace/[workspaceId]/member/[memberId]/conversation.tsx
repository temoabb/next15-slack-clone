import { Loader } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";

import { Header } from "./header";
import ChatInput from "./chat-input";

import { usePanel } from "@/hooks/use-panel";
import { useMemberId } from "@/hooks/use-member-id";

import { MessageList } from "@/components/message-list";

import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

interface ConversationProps {
  conversationId: Id<"conversations">;
}

export const Conversation: React.FC<ConversationProps> = ({
  conversationId,
}) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  // Note: this is a data of a person who we are trying to communicate:
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    memberId,
  });

  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({ conversationId });

  const handleOpenProfile = () => {
    onOpenProfile(memberId);
  };

  if (isMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberImage={member?.user.image}
        memberName={member?.user.name}
        onClick={handleOpenProfile}
      />

      <MessageList
        data={messages}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />

      <ChatInput
        conversationId={conversationId}
        placeholder={`Message ${member?.user.name}`}
      />
    </div>
  );
};
