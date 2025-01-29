import { RefObject, useEffect, useRef } from "react";
import { ImageIcon, Smile } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import { Delta, Op } from "quill/core";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { Button } from "./ui/button";
import Hint from "./hint";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor: React.FC<EditorProps> = ({
  onCancel,
  onSubmit,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.log("No ref");
      return;
    }

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
    };

    // console.log("Container", container);
    // console.log("Editor container", editorContainer);

    new Quill(editorContainer, options);

    return () => {
      // console.log("CLEANUP");
      if (container) {
        // console.log("CLEANUP_IS CONTAINER");
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="border h-full ql-custom" />
        <div className="flex p-2 pb-2 z-[5]">
          <Hint label="Hide formatting">
            <Button
              size="iconSm"
              disabled={false}
              variant="ghost"
              onClick={() => {}}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          <Hint label="Emoji">
            <Button
              size="iconSm"
              disabled={false}
              variant="ghost"
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>

          {variant === "update" ? (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={false}
              >
                Cancel
              </Button>
              <Button
                disabled={false}
                onClick={() => {}}
                size="sm"
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          ) : null}

          {variant === "create" ? (
            <Hint label="Image">
              <Button
                size="iconSm"
                disabled={false}
                variant="ghost"
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          ) : null}

          {variant === "create" ? (
            <Button
              disabled={false}
              onClick={() => {}}
              size="iconSm"
              className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
            >
              <MdSend size={4} />
            </Button>
          ) : null}
        </div>
      </div>
      <div className="p-2 text-muted-foreground text-[10px flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
