"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import UserButton from "@/features/auth/components/UserButton";
import useGetWorkSpaces from "@/features/workspaces/api/useGetWorkspaces";
import useCreateWorkspaceModal from "@/features/workspaces/store/useCreateWorkspaceModal";

// If component is a client component ("use client") and it is a wrapper on the {children}, it does not mean children and their children need to be a client components. They could be SERVER components too.

export default function Home() {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkSpaces();

  // console.log("workspaces", data);

  const workspaceId = useMemo(() => {
    // console.log("NEW DATA", data);
    return data?.[0]?._id;
  }, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      // console.log("Redirecting to the workspace");

      // This is a side-effect
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}
