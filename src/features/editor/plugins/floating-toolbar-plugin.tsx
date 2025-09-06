import React from "react";
import FloatingToolbar from "@/features/editor/components/floating-toolbar";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import { Tool } from "../interfaces/tool";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";

export const FloatingToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  // helper to detect format at current selection
  const selectionHasFormat = (format: string) => {
    try {
      return editor.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // RangeSelection has hasFormat in Lexical
          // @ts-expect-error -- just for test
          return selection.hasFormat(format);
        }
        return false;
      });
    } catch {
      return false;
    }
  };

  const tools: Tool[] = [
    {
      id: "bold",
      label: "Bold",
      icon: <Bold />,
      type: "toggle",
      execute: (ed) => {
        // toggle bold via Lexical FORMAT_TEXT_COMMAND
        ed.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      },
      isActive: () => selectionHasFormat("bold"),
    },
    {
      id: "italic",
      label: "Italic",
      icon: <Italic />,
      type: "toggle",
      execute: (ed) => {
        ed.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      },
      isActive: () => selectionHasFormat("italic"),
    },
    {
      id: "underline",
      label: "Underline",
      icon: <Underline />,
      type: "toggle",
      execute: (ed) => {
        ed.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
      },
      isActive: () => selectionHasFormat("underline"),
    },
    {
      id: "strikethrough",
      label: "Strikethrough",
      icon: <Strikethrough />,
      type: "toggle",
      execute: (ed) => {
        ed.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
      },
      isActive: () => selectionHasFormat("strikethrough"),
    },
    // add more tools here (heading, lists, link, etc.)
  ];

  return (
    <FloatingToolbar>
      <Toolbar editor={editor} tools={tools} />
    </FloatingToolbar>
  );
};

export default FloatingToolbarPlugin;
