import React, { useEffect } from "react";
import FloatingToolbar from "@/features/editor/components/floating-toolbar";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import { DropdownTool, ToggleGroupTools, Tool } from "../interfaces/tool";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  LexicalEditor,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
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
import {
  handleSelectionUpdate,
  type SelectionState,
  DEFAULT_SELECTION_STATE,
  TextLevel,
} from "@/features/editor/components/utils/selection-checkers";

export const FloatingToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = React.useState<SelectionState>(
    DEFAULT_SELECTION_STATE
  );
  // TODO: we need some kind of architecture and responsibility management for the tools
  // TODO: we need to add checkers that check for each format

  useEffect(() => {
    const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        // forward update to the centralized selection handler (placeholder for now)
        if (selection) {
          const newState = handleSelectionUpdate(selection);
          setSelectionState(newState);
        } else {
          setSelectionState(DEFAULT_SELECTION_STATE);
        }
      });
    });

    return () => unsubscribe();
  }, [editor]);

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
        isActive: selectionState.alignment === "left",
      },
      {
        id: "center",
        type: "toggle",
        label: "Center",
        icon: <AlignCenter />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        },
        isActive: selectionState.alignment === "center",
      },
      {
        id: "right",
        type: "toggle",
        label: "Right",
        icon: <AlignRight />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        },
        isActive: selectionState.alignment === "right",
      },
      {
        id: "justify",
        type: "toggle",
        label: "Justify",
        icon: <AlignJustify />,
        execute: (ed) => {
          ed.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        },
        isActive: selectionState.alignment === "justify",
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
        isActive: selectionState.format.bold,
      },
      {
        id: "italic",
        label: "Italic",
        icon: <Italic />,
        type: "toggle",
        execute: (ed: LexicalEditor) => {
          ed.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        },
        isActive: selectionState.format.italic,
      },
      {
        id: "underline",
        label: "Underline",
        icon: <Underline />,
        type: "toggle",
        execute: (ed: LexicalEditor) => {
          ed.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        },
        isActive: selectionState.format.underline,
      },
      {
        id: "strikethrough",
        label: "Strikethrough",
        icon: <Strikethrough />,
        type: "toggle",
        execute: (ed: LexicalEditor) => {
          ed.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        },
        isActive: selectionState.format.strikethrough,
      },
    ],
  };
  // TODO: we should make the value as type to help with types
  const textLevel: DropdownTool<TextLevel> = {
    id: "text-level",
    label: "Text Level",
    type: "dropdown",
    items: [
      {
        label: "Heading 1",
        value: "h1",
      },
      {
        label: "Heading 2",
        value: "h2",
      },
      {
        label: "Heading 3",
        value: "h3",
      },
      {
        label: "Text",
        value: "paragraph",
      },
    ],
    value: selectionState.level,
    execute: (ed, value) => {
      ed.update(() => {
        const selection = $getSelection();
        if (value === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(value));
        }
      });
    },
  };
  const tools: Tool[] = [textLevel as Tool, formatingTextTools, alignmentsTool];

  return (
    <FloatingToolbar>
      <Toolbar editor={editor} tools={tools} />
    </FloatingToolbar>
  );
};

export default FloatingToolbarPlugin;
