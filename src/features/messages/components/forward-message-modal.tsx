import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Quill from "quill";
import dynamic from "next/dynamic";

import { toast } from "sonner";

import { Id } from "../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { ChannelsMembersSearch } from "./channels-members-search";
import ForwardMessagePreview from "./forward-message-preview";

import { useForwardMessage } from "../api/use-forward-message";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Preview } from "../config";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

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

  const editorRef = useRef<Quill | null>(null);

  const {
    messageId,
    messageImage,
    authorMemberId,
    authorName,
    authorImage,
    messageBody: forwardingMessageBody,
  } = rest;

  const [destination, setDestination] = useState<Preview | null>(null);

  const { mutate: forwardMessage, isPending: isForwardingMessage } =
    useForwardMessage();

  const onForward = ({ body }: { body: string }) => {
    if (!destination?.id) {
      toast.error("No destination provided");
      return;
    }

    forwardMessage(
      {
        body,
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

  const handleClose = () => {
    setDestination(null);
    onClose(false);
  };

  const handleForward = () => {
    const body = JSON.stringify(editorRef.current?.getContents());

    if (body) {
      onForward({ body });
    } else toast.error("Something went wrong");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "transition-all duration-300 max-h-[700px] w-[512px] rounded-lg overflow-x-hidden overflow-y-scroll dialogs-scrollbar flex flex-col"
        )}
      >
        <DialogDescription />

        <DialogTitle className="text-2xl mb-5">
          Forward this message
        </DialogTitle>

        <ChannelsMembersSearch
          destination={destination}
          setDestination={setDestination}
          isForwarding={isForwardingMessage}
        />

        <div className="mt-2">
          <Editor
            key={messageId}
            placeholder="Add a message if you like."
            variant="forward"
            onSubmit={onForward}
            disabled={isForwardingMessage}
            innerRef={editorRef}
          />
        </div>

        <ForwardMessagePreview
          body={forwardingMessageBody}
          authorId={authorMemberId}
          authorName={authorName}
          authorImage={authorImage}
          messageImage={messageImage}
        />

        <DialogFooter>
          <Button
            disabled={isForwardingMessage || !destination}
            className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
            onClick={handleForward}
          >
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMessageModal;
