"use client";
import { useEffect, useMemo } from "react";

import { Loader } from "lucide-react";

import UserButton from "@/features/auth/components/UserButton";

import useGetWorkSpaces from "@/features/workspaces/api/useGetWorkspaces";

// If component is a client component ("use client") and it is a wrapper on the {children}, it does not mean children and their children need to be a client components. They can be SERVER components too.

export default function Home() {
  const { data, isLoading } = useGetWorkSpaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to the workspace");
    } else {
      console.log("Open creation modal");
    }
  }, [workspaceId, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}

// npm run dev
// npx convex dev
