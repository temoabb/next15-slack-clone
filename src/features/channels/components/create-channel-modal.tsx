import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import useCreateChannelModal from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useCreateChannelModal();

  const { isPending: creatingChannel, mutate: create } = useCreateChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setName("");
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    create(
      { name, workspaceId },
      {
        onSuccess: (channelId) => {
          toast.success("Channel created");
          router.push(`/workspace/${workspaceId}/channel/${channelId}`);
          handleClose();
        },
        onError: () => {
          toast.error("Can not create a new channel");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={creatingChannel}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={creatingChannel}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
