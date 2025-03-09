import { useState } from "react";
import { Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import useGetWorkSpace from "@/features/workspaces/api/use-get-workspace";
import { DialogTitle } from "@/components/ui/dialog";
import useGetMembers from "@/features/members/api/use-get-members";
import useGetChannels from "@/features/channels/api/use-get-channels";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

const Toolbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const workspaceId = useWorkspaceId();

  const { data } = useGetWorkSpace({ id: workspaceId });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const { data: channels, isLoading: isLoadingChannels } = useGetChannels({
    workspaceId,
  });

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />

      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />

          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  className="cursor-pointer"
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  className="cursor-pointer"
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;

// Next's app router allows us to actually create components here. What is important you do not have to name files reserved words: page, layout, error, loading etc. Again they are reserved keywords when you use app router.

// You can add components in the 'components' folder too, but app router allows us to create components this way.
