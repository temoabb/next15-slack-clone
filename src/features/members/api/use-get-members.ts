import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMembersProps {
  workspaceId: Id<"workspaces">;
}

const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const data = useQuery(api.members.getAll, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetMembers;
