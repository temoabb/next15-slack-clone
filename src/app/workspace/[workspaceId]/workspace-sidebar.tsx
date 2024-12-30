import { AlertTriangle, Loader } from "lucide-react";

import { useWorkspaceId } from "@/hooks/useWorkspaceId";

import WorkspaceHeader from "./workspace-header";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useGetWorkSpace from "@/features/workspaces/api/useGetWorkspace";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkSpace({
    id: workspaceId,
  });

  const { data: currentMember, isLoading: loadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });

  if (loadingWorkspace || loadingCurrentMember) {
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
    <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={isAdmin} />
    </div>
  );
};

export default WorkspaceSidebar;
