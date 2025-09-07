import React from "react";
import FloatingToolbar from "@/features/editor/components/floating-toolbar";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import { ToggleGroupTools, Tool } from "../interfaces/tool";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

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

  const alignmentsTool: ToggleGroupTools = {
    id: "alignments",
    label: "Alignments",
    type: "toggle-group",
    tools: [
      {
        id: "left",
        type: "toggle",
        label: "Left",
        icon: <AlignLeft />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        },
      },
      {
        id: "center",
        type: "toggle",
        label: "Center",
        icon: <AlignCenter />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        },
      },
      {
        id: "right",
        type: "toggle",
        label: "Right",
        icon: <AlignRight />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        },
      },
      {
        id: "justify",
        type: "toggle",
        label: "Justify",
        icon: <AlignJustify />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        },
      },
    ],
  };

  const formatingTextTools: ToggleGroupTools = {
    id: "formatting",
    label: "Text Formatting",
    type: "toggle-group",
    tools: [
      {
        id: "bold",
        label: "Bold",
        icon: <Bold />,
        type: "toggle",
        execute: (ed: LexicalEditor) => {
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
        execute: (ed: LexicalEditor) => {
          ed.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        },
        isActive: () => selectionHasFormat("italic"),
      },
      {
        id: "underline",
        label: "Underline",
        icon: <Underline />,
        type: "toggle",
        execute: (ed: LexicalEditor) => {
          ed.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        },
        isActive: () => selectionHasFormat("underline"),
      },
      {
        id: "strikethrough",
        label: "Strikethrough",
        icon: <Strikethrough />,
        type: "toggle",
        execute: (ed: LexicalEditor) => {
          ed.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        },
        isActive: () => selectionHasFormat("strikethrough"),
      },
    ],
  };
  const tools: Tool[] = [formatingTextTools, alignmentsTool];

  return (
    <FloatingToolbar>
      <Toolbar editor={editor} tools={tools} />
    </FloatingToolbar>
  );
};

export default FloatingToolbarPlugin;
