import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

export const ThreadBar: React.FC<ThreadBarProps> = ({
  count,
  image,
  timestamp,
  name = "Member",
  onClick,
}) => {
  if (!count || !timestamp) return null;

  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="group/thread-bar flex items-center justify-start max-w-[600px] p-1 rounded-md hover:bg-white border border-transparent hover:border-border transition"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};
