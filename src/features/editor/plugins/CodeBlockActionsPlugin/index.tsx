import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useState } from "react";

export const CodeBlockActionsPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [codeBlockRect, setCodeBlockRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!selection) {
          return;
        }
        if ($isRangeSelection(selection)) {
          const element = selection.anchor.getNode().getTopLevelElement();
          if ($isCodeNode(element)) {
            const domElement = editor.getElementByKey(element.getKey());
            const rect = domElement?.getBoundingClientRect();
            setCodeBlockRect(rect || null);
          }
        }
      });
    });
  }, [editor]);

  if (!codeBlockRect) {
    return null;
  }

  return (
    <div
      className="absolute bg-white border p-2"
      style={{
        top: codeBlockRect.top,
        left: codeBlockRect.left + codeBlockRect.width - 200,
      }}
    >
      <h2>Code Block Actions</h2>
    </div>
  );
};

export default CodeBlockActionsPlugin;
