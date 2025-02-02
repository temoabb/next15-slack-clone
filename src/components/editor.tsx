import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ImageIcon, Smile } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import { Delta, Op } from "quill/core";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { Button } from "./ui/button";

import Hint from "./hint";
import { EmojiPopover } from "./emoji-popover";

import { cn } from "@/lib/utils";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
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
  // If we type something, 'quillRef' below will NOT rerender. We need a separate type of control for things that we want to show differently
  const [text, setText] = useState("");

  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  // Refs are to be used inside an useEffect. Everything else should be used via normal regular props.

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // TODO: Submit form
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      // to controll Quill with the same way from outside of the component
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef?.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  // We have to remove some things inside of the texts that are considered empty, but technically have some elements.

  // When you initiate the quill editor,its default value might be something like an empty paragraph: <p></p>

  // This is empty technically, but if we read the text it is not empty: "<p></p>"

  // We have to add a regex to remove all of this elements and after that check if it is an empty.

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    // What is last character's index? If there is none, index will be 0
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="border h-full ql-custom" />
        <div className="flex p-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              size="iconSm"
              disabled={disabled}
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button size="iconSm" disabled={disabled} variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === "update" ? (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
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
                disabled={disabled}
                variant="ghost"
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          ) : null}

          {variant === "create" ? (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {}}
              size="iconSm"
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white hover:bg-white text-muted-foreground"
                  : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              )}
            >
              <MdSend size={4} />
            </Button>
          ) : null}
        </div>
      </div>

      {variant === "create" ? (
        <div
          className={cn(
            "p-2 text-muted-foreground text-[10px flex justify-end opacity-0 transition",
            !isEmpty ? "opacity-100" : ""
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Editor;
