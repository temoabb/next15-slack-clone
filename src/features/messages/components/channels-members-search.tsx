"use client";

import React, { ChangeEvent, useCallback, useState } from "react";

import { XIcon } from "lucide-react";
import debounce from "lodash.debounce";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import useCurrentMember from "@/features/members/api/use-current-member";
import { useGetChannelsAndMembers } from "@/features/channels/api/use-get-channels-and-members";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { SuggestionsSkeleton } from "./suggestions-skeleton";
import { Preview, MemberPreview, ChannelPreview } from "../config";

interface ChannelsMembersSearchProps {
  isForwarding: boolean;
  destination: Preview | null;
  setDestination: (entity: Preview | null) => void;
}

export const ChannelsMembersSearch: React.FC<ChannelsMembersSearchProps> = ({
  destination,
  setDestination,
}) => {
  const workspaceId = useWorkspaceId();

  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isLoading: isLoadingChannelsAndMembers } =
    useGetChannelsAndMembers({
      searchKeyword: searchValue,
    });

  const debouncedQuery = useCallback(
    debounce((query: string) => setSearchValue(query), 500),
    []
  );

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedQuery(e.target.value);
  };

  const handleClearDestination = () => {
    setDestination(null);
    setInputValue("");
  };

  return (
    <div className="min-h-[250px]">
      <div className="relative">
        {destination ? (
          <div className="z-50 bg-[#e4eff1] rounded-md absolute h-[80%] top-1 left-1 flex items-center justify-between p-1.5 min-w-[250px]">
            <div className="flex items-center">
              {destination.type === "members" ? (
                <Avatar className="w-6 h-6 border flex items-center justify-center">
                  <AvatarImage src={destination.image || undefined} />
                  <AvatarFallback className="bg-sky-500 flex items-center justify-center w-full h-full text-white text-sm">
                    {destination.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : null}

              <span className="ml-2 text-sm text-muted-foreground">
                {destination.type === "channels" ? "# " : ""}
                {destination.name}{" "}
                {destination.id === currentMember?._id ? "(you)" : ""}{" "}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearDestination}
              className="w-[25px] h-[25px]"
            >
              <XIcon className="size-5 stroke-[1.5]" />
            </Button>
          </div>
        ) : null}

        <Input
          disabled={Boolean(destination)}
          className="z-[-100]"
          value={inputValue}
          placeholder="Add by name or channel"
          onChange={onChange}
        />
      </div>

      {data ? (
        <ul className="pt-2 my-2 border min-h-[80px] rounded-md">
          {data.members?.map((item) => (
            <li
              key={item.id}
              onClick={() => setDestination(item as MemberPreview)}
              className="flex items-center gap-x-1 hover:bg-[#33a8c9] hover:text-white cursor-pointer pl-4 py-1 text-[16px]"
            >
              <Avatar className="w-6 h-6 border flex items-center justify-center">
                <AvatarImage src={item.image || undefined} />
                <AvatarFallback className="bg-sky-500 flex items-center justify-center w-full h-full text-white text-sm">
                  {item.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {item.name} {currentMember?._id === item.id ? "(you)" : ""}
              </span>
            </li>
          ))}

          {data.channels?.map((item) => (
            <li
              key={item.id}
              onClick={() => setDestination(item as ChannelPreview)}
              className="hover:bg-[#33a8c9] hover:text-white cursor-pointer pl-4 py-1 text-[16px]"
            >
              <span>#</span>
              <span className="ml-3 text-sm text-muted-foreground">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {searchValue.length > 2 && isLoadingChannelsAndMembers ? (
        <SuggestionsSkeleton amount={3} />
      ) : null}
    </div>
  );
};
