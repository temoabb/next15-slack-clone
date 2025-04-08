import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import Quill from "quill";
import { toast } from "sonner";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type CreateMessageValues = {
  // channelId: Id<"channels">;
  conversationId: Id<"conversations">;
  body: string;
  workspaceId: Id<"workspaces">;
  image?: Id<"_storage"> | undefined;
};

const ChatInput: React.FC<ChatInputProps> = ({
  placeholder,
  conversationId,
}) => {
  const workspaceId = useWorkspaceId();

  const editorRef = useRef<Quill | null>(null); // To controll Quill with the same way from outside of the child component

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: createMessage } = useCreateMessage();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

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

      // Since this component is for 1:1 conversations, we do not need 'channelId' here.
      // We replace it with a 'conversationId':
      const values: CreateMessageValues = {
        body,
        // channelId,
        conversationId,
        workspaceId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl(null, { throwError: true });

        if (!url) throw new Error("Url not found");

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
      console.error(error);
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
