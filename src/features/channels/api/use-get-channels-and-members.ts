import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface UseGetChannelsAndMembersProps {
  searchKeyword: string;
}

export const useGetChannelsAndMembers = ({
  searchKeyword,
}: UseGetChannelsAndMembersProps) => {
  const workspaceId = useWorkspaceId();

  const data = useQuery(
    api.members.getMembersAndChannels,
    searchKeyword && searchKeyword.length > 2
      ? {
          workspaceId,
          searchText: searchKeyword,
        }
      : "skip"
  );

  const isLoading = data === undefined;

  return { data, isLoading };
};
