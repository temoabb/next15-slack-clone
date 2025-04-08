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

import { cn } from "@/lib/utils";

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

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedQuery(e.target.value);
  };

  const handleClearDestination = () => {
    setDestination(null);
    setInputValue("");
    setSearchValue("");
  };

  return (
    <div className="">
      <div className="relative transition-all duration-300 ease-in-out">
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

              <span className="ml-2 text-sm font-semibold">
                {destination.type === "channels" ? "# " : ""}
                {destination.name}{" "}
                {destination.id === currentMember?._id ? "you" : ""}{" "}
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

      {searchValue && !destination ? (
        <div
          className={cn(
            "relative w-full h-[250px] mt-4 shadow-sm overflow-auto messages-scrollbar transition-all duration-300 ease-in-out"
          )}
        >
          {data?.channels?.length === 0 && data?.members.length === 0 ? (
            <p className="my-4 text-md text-center text-muted-foreground">
              No items
            </p>
          ) : null}

          {(data?.members?.length || data?.channels?.length) && searchValue ? (
            <ul className="">
              {data.members?.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setDestination(item as MemberPreview)}
                  className="flex items-center gap-x-1 hover:bg-[#bae6fd] cursor-pointer pl-4 py-2"
                >
                  <Avatar className="w-6 h-6 border flex items-center justify-center border-none">
                    <AvatarImage src={item.image || undefined} />
                    <AvatarFallback className="bg-sky-500 flex items-center justify-center w-full h-full text-white text-sm">
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-[16px] font-semibold ml-2">
                    {item.name} {currentMember?._id === item.id ? "(you)" : ""}
                  </span>
                </li>
              ))}

              {data?.channels?.length
                ? data.channels?.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => setDestination(item as ChannelPreview)}
                      className="text-md truncat hover:bg-[#bae6fd] text-[16px] font-semibold cursor-pointer pl-5 py-2 transition-all duration-300 ease-in-out"
                    >
                      <span>#</span>
                      <span className="ml-3">{item.name}</span>
                    </li>
                  ))
                : null}
            </ul>
          ) : null}

          {searchValue.length > 2 && isLoadingChannelsAndMembers ? (
            <div className="pl-4">
              <SuggestionsSkeleton amount={3} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
