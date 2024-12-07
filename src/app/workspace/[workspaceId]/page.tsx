"use client";

import useGetWorkSpace from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

// interface WorkspaceIdPageProps {
//   params: {
//     workspaceId: string;
//   };
// }

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkSpace({ id: workspaceId });

  return <div>ID: {data?.name} Workspace</div>;
};

export default WorkspaceIdPage;
