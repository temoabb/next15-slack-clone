import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}

const useCurrentMember = ({ workspaceId }: UseCurrentMemberProps) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};

export default useCurrentMember;
