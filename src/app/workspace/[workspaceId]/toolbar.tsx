import { Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import useGetWorkSpace from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkSpace({ id: workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;

// Next's app router allows us to actually create components here. What is important you do not have to name files reserved words: page, layout, error, loading etc. Again they are reserved keywords when you use app router.

// You can add components in the 'components' folder too, but app router allows us to create components this way.
