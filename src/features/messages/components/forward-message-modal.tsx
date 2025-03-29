import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

// import Quill from "quill";
// import dynamic from "next/dynamic";

import { Id } from "../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { ChannelsMembersSearch } from "./channels-members-search";
import ForwardMessagePreview from "./forward-message-preview";

import { useForwardMessage } from "../api/use-forward-message";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Preview } from "../config";

// const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ForwardMessageModalProps {
  open: boolean;
  onClose: (value: boolean) => void;

  messageId: Id<"messages">;
  messageBody: string;
  messageImage?: string;

  authorMemberId: Id<"members">;
  authorName: string;
  authorImage?: string;

  updatedAt?: number;
}

const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  open,
  onClose,
  ...rest
}) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const {
    messageId,
    messageImage,
    authorMemberId,
    authorName,
    authorImage,
    updatedAt,
    messageBody: forwardingMessageBody,
  } = rest;

  const [destination, setDestination] = useState<Preview | null>(null);

  const { mutate: forwardMessage, isPending: isForwardingMessage } =
    useForwardMessage();

  const isLoading = isForwardingMessage;

  const onForward = () => {
    if (!destination?.id) {
      toast.error("Provide destination id");
      return;
    }

    forwardMessage(
      {
        // TODO: add a mesasge body
        body: '{"ops":[{"insert":"\\n"}]}',
        workspaceId,

        forwardingMessage: {
          id: messageId,
          authorMemberId,
        },

        destination: {
          memberId: destination.type === "members" ? destination.id : undefined,
          channelId:
            destination.type === "channels" ? destination.id : undefined,
        },
      },
      {
        onSuccess: () => {
          setDestination(null);
          router.push(
            `/workspace/${workspaceId}/${destination.type === "channels" ? "channel/" + destination.id : "member/" + destination.id}`
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="transition">
        <DialogDescription />
        <DialogTitle className="text-2xl mb-5">
          Forward this message
        </DialogTitle>

        <ChannelsMembersSearch
          destination={destination}
          setDestination={setDestination}
          isForwarding={isForwardingMessage}
        />

        <ForwardMessagePreview
          body={forwardingMessageBody}
          authorId={authorMemberId}
          authorName={authorName}
          authorImage={authorImage}
          messageImage={messageImage}
        />

        {/* TODO: Add <Editor /> component here for a new message about forwarded message  */}

        <DialogFooter>
          <Button
            disabled={isLoading || !destination}
            className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
            onClick={onForward}
          >
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMessageModal;
