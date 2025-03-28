import {
  MessageSquareTextIcon,
  Pencil,
  Smile,
  Trash,
  ForwardIcon,
} from "lucide-react";

import Hint from "./hint";
import { EmojiPopover } from "./emoji-popover";

import { Button } from "./ui/button";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
  isForwarded?: boolean;
  handleForward: () => void;
}

export const MessageToolbar: React.FC<MessageToolbarProps> = ({
  isAuthor,
  isPending,
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  handleForward,
  hideThreadButton,
  isForwarded = false,
}) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji: any) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>

        {isAuthor && !isForwarded ? (
          <Hint label="Edit message">
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        ) : null}

        {!hideThreadButton ? (
          <Hint label="Reply in thread">
            <Button
              onClick={handleThread}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        ) : null}

        <Hint label="Forward message">
          <Button
            onClick={handleForward}
            variant="ghost"
            size="iconSm"
            disabled={isPending}
          >
            <ForwardIcon className="size-4" />
          </Button>
        </Hint>

        {isAuthor ? (
          <Hint label="Delete message">
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        ) : null}
      </div>
    </div>
  );
};
