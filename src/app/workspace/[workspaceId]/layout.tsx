"use client";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import WorkspaceSidebar from "./workspace-sidebar";

import { usePanel } from "@/hooks/use-panel";

import Thread from "@/features/messages/components/thread";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout: React.FC<WorkspaceIdLayoutProps> = ({ children }) => {
  const { parentMessageId, onClose } = usePanel();

  const showThreadsPanel = !!parentMessageId;

  // Toolbar's (whereas the Search component is) height is 40px.

  // So we calculated resizable panels' parent div's content's height below for:
  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="slack-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={20}>{children}</ResizablePanel>

          {showThreadsPanel ? (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  // An edge case, but if it happens we will have a fallback here:
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;

// NOTE: The layout part WILL NOT rerender on route changes

// Also by default child components ARE NOT client components since they are passed through with 'children' prop
