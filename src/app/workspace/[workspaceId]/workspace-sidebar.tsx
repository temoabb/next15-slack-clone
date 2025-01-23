import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import UserItem from "./user-item";
import { SidebarItem } from "./sidebar-item";
import WorkspaceHeader from "./workspace-header";
import WorkspaceSection from "./workspace-section";

import useGetMembers from "@/features/members/api/use-get-members";
import useGetChannels from "@/features/channels/api/use-get-channels";
import useCurrentMember from "@/features/members/api/use-current-member";
import useGetWorkSpace from "@/features/workspaces/api/useGetWorkspace";
// import CreateChannelModal from "@/features/channels/components/create-channel-modal";
import useCreateChannelModal from "@/features/channels/store/use-create-channel-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const [, setOpen] = useCreateChannelModal();

  // Current workspace:
  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkSpace({
    id: workspaceId,
  });

  // Current member:
  const { data: currentMember, isLoading: loadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });

  // Channels in the current workspace:
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  // All members of the workspace:
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (
    loadingWorkspace ||
    loadingCurrentMember ||
    channelsLoading ||
    membersLoading
  ) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !currentMember) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace or member not found</p>
      </div>
    );
  }

  const isAdmin = currentMember.role === "admin";

  return (
    <>
      {/* <CreateChannelModal /> */}
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full">
        <WorkspaceHeader workspace={workspace} isAdmin={isAdmin} />

        <div className="flex flex-col px-2 mt-3">
          <SidebarItem
            label="threads"
            icon={MessageSquareText}
            id="threads"
            // variant="active"
          />
          <SidebarItem
            label="Drafts & Sent"
            icon={SendHorizonal}
            id="drafts"
            // variant="active"
          />
        </div>

        <WorkspaceSection
          label="Channels"
          hint="New channel"
          onNew={
            currentMember.role === "admin" ? () => setOpen(true) : undefined
          }
        >
          {channels?.map((item) => (
            <SidebarItem
              key={item._id}
              id={item._id}
              icon={HashIcon}
              label={item.name}
            />
          ))}
        </WorkspaceSection>

        <WorkspaceSection
          label="Direct messages"
          hint="New direct message"
          onNew={() => {}}
        >
          {members?.map((item) => (
            <UserItem
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
              // variant={currentMember._id === item._id ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>
      </div>
    </>
  );
};

export default WorkspaceSidebar;
