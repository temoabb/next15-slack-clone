import dynamic from "next/dynamic";
import { Id } from "../../../../convex/_generated/dataModel";

import { Thumbnail } from "@/components/thumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePanel } from "@/hooks/use-panel";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

interface ForwardMessagePreveiwPros {
  body?: string;
  authorId: Id<"members">;
  authorName: string;
  authorImage?: string;
  messageImage?: string;
  updatedAt?: number;
}

export const ForwardMessagePreview: React.FC<ForwardMessagePreveiwPros> = ({
  body = "",
  authorId,
  authorName,
  authorImage,
  messageImage,
  updatedAt,
}) => {
  const { onOpenProfile } = usePanel();

  const handleProfile = () => {
    onOpenProfile(authorId);
  };

  console.log("Message image", messageImage);

  const avatarFallback = authorName.charAt(0).toUpperCase();

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

          <span className="font-bold text-[14px] text-primary hover:underline">
            {authorName}
          </span>
        </div>

        <Renderer value={body} />

        <Thumbnail url={messageImage} />

        <div className="flex items-center text-xs gap-x-1 text-muted-foreground">
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

export default ForwardMessagePreview;
