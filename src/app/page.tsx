"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import UserButton from "@/features/auth/components/UserButton";
import useGetWorkSpaces from "@/features/workspaces/api/useGetWorkspaces";
import useCreateWorkspaceModal from "@/features/workspaces/store/useCreateWorkspaceModal";

// If component is a client component ("use client") and it is a wrapper on the {children}, it does not mean children and their children need to be a client components. They could be SERVER components too.

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkSpaces();

  const router = useRouter();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    // console.log("Home effect");

    if (isLoading) return;

    if (workspaceId) {
      console.log("Redirect to the workspace");

      // This is a side-effectc
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
      // console.log("Open creation modal");
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  if (isLoading) {
    return <Loader className="size-4 aninate-spin text-muted-foreground" />;
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}

// npm run dev
// npx convex dev
