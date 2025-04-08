import Image from "next/image";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ImageIcon, Smile, XIcon } from "lucide-react";

import Quill, { type QuillOptions } from "quill";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { Delta, Op } from "quill/core";
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
  variant?: "create" | "update" | "forward";
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
  // If we type something, 'quillRef' below will NOT rerender.
  // We need a separate type of control for things that we want to show differently:
  const [text, setText] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);

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

  // Refs are to be used inside an useEffect.
  // Everything else should be used via normal regular props.

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
                // Here we do not need to call the quillRef.
                // We have access to the actual quill, which is below.

                // 'options' is an argument for initializing a new Quill.

                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
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
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    const length = quill.getLength(); // Get text length
    quill.setSelection(length, 0); // Set cursor to the end

    if (innerRef) {
      innerRef.current = quill; // to controll Quill with the same way from outside of the component
    }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    // What is last character's index? If there is none, index will be 0
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />

      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50"
        )}
      >
        <div ref={containerRef} className="border h-full ql-custom" />

        {/* VIEW chosen image */}
        {!!image ? (
          <div className="p-2 border-green-500 ">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>

              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="flex p-2 pb-2 z-[5]">
          {/* hide / show toolbar */}
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

          {/* hide / show emojis */}

          {/* TODO: show emoji popover for forwarding messages too  */}
          {variant !== "forward" ? (
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button size="iconSm" disabled={disabled} variant="ghost">
                <Smile className="size-4" />
              </Button>
            </EmojiPopover>
          ) : null}

          {/* UPDATE: cancel / save  */}
          {variant === "update" ? (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                size="sm"
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          ) : null}

          {/* CREATE: image upload  */}
          {variant === "create" ? (
            <Hint label="Image">
              <Button
                size="iconSm"
                disabled={disabled}
                variant="ghost"
                // Simulate clicking on the phantom input element above (which is hidden):
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          ) : null}

          {/* CREATE || FORWARD: send */}
          {variant !== "update" ? (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
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

      {/* CREATE || FORWARD: add a new line */}
      {variant !== "update" ? (
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
