import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetWorkspaceInfoProps {
  id: Id<"workspaces">;
}

const useGetWorkspaceInfo = ({ id }: useGetWorkspaceInfoProps) => {
  const data = useQuery(api.workspaces.getInfoById, { workspaceId: id });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetWorkspaceInfo;
