"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/useCreateWorkspace";
import useCreateWorkspaceModal from "../store/useCreateWorkspaceModal";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const { createWorkspace } = useCreateWorkspace();
  const [value, setValue] = useState("");

  const handleSubmit = (name: string) => {
    createWorkspace(
      { name },
      {
        onSuccess: (data) => {
          router.push(`/workspaces/${data.__tableName}`);
        },
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    // TODO: clear form
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <Input
            value={value}
            disabled={false}
            autoFocus
            required
            minLength={3}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button onClick={() => handleSubmit} disabled={false} className="">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
