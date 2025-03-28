import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Id } from "../../convex/_generated/dataModel";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Thumbnail } from "./thumbnail";

import { usePanel } from "@/hooks/use-panel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

interface ForwardedMessageProps {
  body: string;
  image?: string;
  createdAt: number;
  authorName: string;
  authorImage?: string;
  updatedAt?: number;
  authorMemberId: Id<"members">;
  originName: string;
  originType: "channels" | "conversations";
  originId: Id<"channels"> | Id<"conversations">;
}

const ForwardedMessage: React.FC<ForwardedMessageProps> = ({
  body,
  image,
  createdAt,
  updatedAt,
  authorName,
  authorImage,
  authorMemberId,
  originId,
  originName,
  originType,
}) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { onOpenProfile } = usePanel();

  const handleProfile = () => {
    onOpenProfile(authorMemberId);
  };

  const onOpenChannelOrConversation = () => {
    router.push(
      `/workspace/${workspaceId}/${originType === "channels" ? "channel" : "member"}/${originId}`
    );
  };

  const avatarFallback = authorName?.charAt(0).toUpperCase() ?? "M";

  return (
    <div className="flex w-full gap-x-2 my-1.5">
      <div className="w-1 rounded-md bg-gray-200" />

      <div className="flex flex-col flex-1 gap-y-0.5">
        <div className="flex items-center gap-x-1">
          <button onClick={handleProfile}>
            <Avatar className="size-5 cursor-pointer">
              <AvatarImage className="rounded-sm" src={authorImage} />
              <AvatarFallback className="text-xs">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>

          <button
            onClick={handleProfile}
            className="font-bold text-[14px] text-primary hover:underline"
          >
            {authorName}
          </button>
        </div>

        <Renderer value={body} />

        <Thumbnail url={image} />

        <div className="flex items-center text-xs gap-x-1 text-muted-foreground">
          {originType === "channels" ? (
            <>
              <button
                className="hover:underline"
                onClick={onOpenChannelOrConversation}
              >
                <span>Posted in</span>
              </button>

              <span className="text-[14px]">#</span>
            </>
          ) : null}

          <button onClick={onOpenChannelOrConversation}>
            <span
              className={cn(originType === "channels" && "hover:underline")}
            >
              {originName}
            </span>
          </button>

          <span className="text-gray-300">&#124;</span>

          <button onClick={onOpenChannelOrConversation}>
            <span className="hover:underline">
              {format(new Date(createdAt), "h:mm a")}
            </span>
          </button>

          {updatedAt ? (
            <>
              <span className="text-gray-300">&#124;</span>
              <span className="text-xs text-muted-foreground">(edited)</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ForwardedMessage;
