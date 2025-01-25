"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCreateWorkspaceModal from "../store/use-create-workspace-modal";

import { useCreateWorkspace } from "../api/use-create-workspace";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

const CreateWorkspaceModal = () => {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();
  const [workspaceName, setWorkspaceName] = useState("");

  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setWorkspaceName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        name: workspaceName,
      },
      {
        onSuccess: (workspaceId) => {
          toast.success("Workspace created");
          router.push(`/workspace/${workspaceId}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={workspaceName}
            disabled={isPending}
            autoFocus
            required
            minLength={3}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending} className="">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
