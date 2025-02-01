import { useRef } from "react";
import Quill from "quill";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ placeholder }) => {
  const editorRef = useRef<Quill | null>(null); // To controll Quill with the same way from outside of the child component (this is from where we controll the quill)

  // console.log("ChatInput rendering, EditorRef", editorRef);

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
        // onCancel={() => {}}
      />
    </div>
  );
};

export default ChatInput;
