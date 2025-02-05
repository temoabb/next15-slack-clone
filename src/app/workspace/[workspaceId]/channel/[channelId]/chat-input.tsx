import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import Quill from "quill";
import { toast } from "sonner";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  body: string;
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  image?: Id<"_storage"> | undefined;
};

const ChatInput: React.FC<ChatInputProps> = ({ placeholder }) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  // To controll Quill with the same way from outside of the child component:
  const editorRef = useRef<Quill | null>(null);

  const [editorKey, setEditorKey] = useState(0);

  const [isPending, setIsPending] = useState(false);

  const { mutate: createMessage, isPending: isCreatingMessage } =
    useCreateMessage();

  const { mutate: generateUploadUrl, isPending: isGeneratingUploadUrl } =
    useGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        channelId,
        workspaceId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) throw new Error("Url not foun");

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload an image");

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        onCancel={() => {}}
      />
    </div>
  );
};

export default ChatInput;
