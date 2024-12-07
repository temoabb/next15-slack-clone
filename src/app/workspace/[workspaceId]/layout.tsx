"use client";

import Toolbar from "./toolbar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout: React.FC<WorkspaceIdLayoutProps> = ({ children }) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
};

export default WorkspaceLayout;

// NOTE: The layout part WILL NOT rerender on route changes

// Also by default child components ARE NOT client components since they are passed through with 'children' prop
