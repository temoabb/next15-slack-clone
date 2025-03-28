import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";

import Hint from "./hint";
import { ThreadBar } from "./thread-bar";
import { Thumbnail } from "./thumbnail";
import { Reactions } from "./reactions";
import { MessageToolbar } from "./message-toolbar";
import ForwardedMessage from "./forwarded-message";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { usePanel } from "@/hooks/use-panel";
import { useConfirm } from "@/hooks/use-confirm";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import ForwardMessageModal from "@/features/messages/components/forward-message-modal";

import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

const formatFullTime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterdat" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
  forwardedMessage?: Doc<"messages">["forwardedMessage"];
}

export const Message: React.FC<MessageProps> = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
  forwardedMessage,
}) => {
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();

  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();

  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone."
  );

  const [openForward, setOpenForward] = useState(false);

  const isPending =
    isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          setEditingId(null);
          toast.success("Message updated");
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleRemove = async (id: Id<"messages">) => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message removed");

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to remove message");
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      {
        messageId: id,
        value,
      },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  const handleThread = () => {
    onOpenMessage(id);
  };

  const handleProfile = () => {
    onOpenProfile(memberId);
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />

        <ForwardMessageModal
          open={openForward}
          onClose={setOpenForward}
          forwardingMessageId={id}
          forwardingMessageAuthorMemberId={memberId}
        />

        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>

            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />

                <Thumbnail url={image} />

                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}

                {forwardedMessage ? (
                  <ForwardedMessage
                    body={forwardedMessage.body ?? ""}
                    image={forwardedMessage.image}
                    createdAt={forwardedMessage._creationTime}
                    authorName={forwardedMessage.author.name}
                    authorMemberId={forwardedMessage.author.memberId}
                    authorImage={forwardedMessage.author.image}
                    updatedAt={forwardedMessage.updatedAt}
                    originId={forwardedMessage.origin.id}
                    originType={forwardedMessage.origin.type}
                    originName={forwardedMessage.origin.name}
                  />
                ) : null}

                <Reactions data={reactions} onChange={handleReaction} />

                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={handleThread}
                />
              </div>
            )}
          </div>

          {!isEditing ? (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleForward={() => setOpenForward(true)}
              handleEdit={() => setEditingId(id)}
              handleThread={handleThread}
              handleDelete={() => handleRemove(id)}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          ) : null}
        </div>
      </>
    );
  }

  const avatarFallback = authorName?.charAt(0).toUpperCase() ?? "M";

  return (
    <>
      <ConfirmDialog />

      <ForwardMessageModal
        open={openForward}
        onClose={setOpenForward}
        forwardingMessageId={id}
        forwardingMessageAuthorMemberId={memberId}
      />

      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={handleProfile}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>

          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hiden">
              <div className="text-sm">
                <button
                  onClick={handleProfile}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>

                <span>&nbsp;&nbsp;</span>

                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>

              <Renderer value={body} />

              <Thumbnail url={image} />

              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}

              {forwardedMessage ? (
                <ForwardedMessage
                  body={forwardedMessage.body ?? ""}
                  image={forwardedMessage.image}
                  createdAt={forwardedMessage._creationTime}
                  authorName={forwardedMessage.author.name}
                  authorMemberId={forwardedMessage.author.memberId}
                  authorImage={forwardedMessage.author.image}
                  updatedAt={forwardedMessage.updatedAt}
                  originId={forwardedMessage.origin.id}
                  originType={forwardedMessage.origin.type}
                  originName={forwardedMessage.origin.name}
                />
              ) : null}

              <Reactions data={reactions} onChange={handleReaction} />

              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={handleThread}
              />
            </div>
          )}
        </div>

        {!isEditing ? (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={handleThread}
            handleDelete={() => handleRemove(id)}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
            handleForward={() => setOpenForward(true)}
          />
        ) : null}
      </div>
    </>
  );
};

export default Message;

// If the same user sends a message NOT even MINUTES apart, the second message of that user and any subsequent message after that will be a COMPACT MESSAGE.

// We do not want to see user's name and an image so many times if they are writing in a very short interval.
