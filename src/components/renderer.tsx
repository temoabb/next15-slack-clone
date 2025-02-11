import { useState, useEffect, useRef } from "react";

import Quill from "quill";

interface RendererProps {
  value: string;
}

const Renderer: React.FC<RendererProps> = ({ value }) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;

    const quill = new Quill(document.createElement("div"), {
      theme: "snow", // Nothing more. We aren't bulding an editor. We just want to render the text.
    });

    quill.enable(false); // To ensure that quill is not enabled (READONLY mode):

    const contents = JSON.parse(value);
    quill.setContents(contents);

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;

    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  // The scenario if someone just sent an image. Renderer will not display anything
  if (isEmpty) return null;

  return <div ref={rendererRef} className="ql-editor ql-renderer" />;
};

export default Renderer;
