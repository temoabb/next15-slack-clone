import { PropsWithChildren } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceMemberHoverCardProps {
  id: Id<"members">;
  name: string;
  image?: string;
  role: Doc<"members">["role"];
  currentMemberId?: Id<"members">;
}

const WorkspaceMemberHoverCard: React.FC<
  PropsWithChildren<WorkspaceMemberHoverCardProps>
> = ({ id, name, image, role, currentMemberId, children }) => {
  const avatarFallback = name.charAt(0).toUpperCase() || "M";

  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>

      <HoverCardContent className="min-w-[350px] my-2 p-0 z-50">
        <div className="flex flex-col gap-y-4 rounded-md overflow-hidden pb-4">
          <p className="bg-gray-100 py-2 pl-4 font-semibold">
            Workspace {role === "admin" ? "owner" : "member"}
          </p>

          <div className="flex items-center gap-x-1 px-4">
            <Avatar className="size-[75px] mr-2">
              <AvatarImage src={image} alt="member" />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>

            <h1 className="font-semibold text-[16px]">
              {name} {currentMemberId && currentMemberId === id ? "(you)" : ""}
            </h1>
          </div>

          <Separator />

          <p className="flex items-center gap-x-2 text-sm text-muted-foreground px-4">
            <Clock className="size-4" />
            {format(new Date(), "h:mm a")} local time
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default WorkspaceMemberHoverCard;
