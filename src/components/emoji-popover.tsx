import { PropsWithChildren, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";

interface EmojiPopoverProps extends PropsWithChildren {
  hint?: string;
  onEmojiSelect: (emoji: unknown) => void;
}

export const EmojiPopover: React.FC<EmojiPopoverProps> = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}) => {
  const [popoverOpen, setPopopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: unknown) => {
    onEmojiSelect(emoji);
    setPopopoverOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>

          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
