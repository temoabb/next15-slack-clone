import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";

import { Thumbnail } from "../../../components/thumbnail";

import { usePanel } from "@/hooks/use-panel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

import { cn } from "@/lib/utils";

import { type ForwardedMessageProps } from "../config";

export const ForwardedMessage: React.FC<ForwardedMessageProps> = ({
  // id,
  body = "",
  image,
  author,
  origin,
  _creationTime,
  updatedAt,
}) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { onOpenProfile } = usePanel();

  const handleProfile = () => {
    onOpenProfile(author.memberId);
  };

  const onOpenChannelOrConversation = () => {
    router.push(
      `/workspace/${workspaceId}/${origin.type === "channels" ? "channel" : "member"}/${origin.id}`
    );
  };

  const avatarFallback = author.name?.charAt(0).toUpperCase() ?? "M";

  return (
    <div className="flex w-full gap-x-2 my-1.5">
      <div className="w-1 rounded-md bg-gray-200" />

      <div className="flex flex-col flex-1 gap-y-0.5">
        <div className="flex items-center gap-x-1">
          <button onClick={handleProfile}>
            <Avatar className="size-5 cursor-pointer">
              <AvatarImage className="rounded-sm" src={author.image} />
              <AvatarFallback className="text-xs">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>

          <button
            onClick={handleProfile}
            className="font-bold text-[14px] text-primary hover:underline"
          >
            {author.name}
          </button>
        </div>

        <Renderer value={body} />

        <Thumbnail url={image} />

        <div className="flex items-center text-xs gap-x-1 text-muted-foreground">
          {origin.type === "channels" ? (
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
              className={cn(origin.type === "channels" && "hover:underline")}
            >
              {origin.name}
            </span>
          </button>

          <span className="text-gray-300">&#124;</span>

          <button onClick={onOpenChannelOrConversation}>
            <span className="hover:underline">
              {format(new Date(_creationTime), "h:mm a")}
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
