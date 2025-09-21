import React, { memo, useEffect, useMemo } from "react";
import FloatingToolbar from "@/features/editor/components/floating-toolbar";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import {
  DropdownTool,
  ToggleGroupTools,
  Tool,
  ValueTool,
} from "../interfaces/tool";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
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
} from "@/features/editor/components/utils/selection-checkers";

export const FloatingToolbarPlugin: React.FC = memo(() => {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = React.useState<SelectionState>(
    DEFAULT_SELECTION_STATE
  );

  const isSelectionStateEqual = React.useCallback(
    (a: SelectionState, b: SelectionState) => {
      return (
        a.alignment === b.alignment &&
        a.level === b.level &&
        a.textColor === b.textColor &&
        a.format.bold === b.format.bold &&
        a.format.italic === b.format.italic &&
        a.format.underline === b.format.underline &&
        a.format.strikethrough === b.format.strikethrough
      );
    },
    []
  );

  useEffect(() => {
    const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        const nextState = selection
          ? handleSelectionUpdate(selection)
          : DEFAULT_SELECTION_STATE;
        setSelectionState((prev) =>
          isSelectionStateEqual(prev, nextState) ? prev : nextState
        );
      });
    });

    return () => unsubscribe();
  }, [editor, isSelectionStateEqual]);

  const tools: Tool[] = useMemo(() => {
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
          execute: () => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          },
          isActive: selectionState.alignment === "left",
        },
        {
          id: "center",
          type: "toggle",
          label: "Center",
          icon: <AlignCenter />,
          execute: () => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          },
          isActive: selectionState.alignment === "center",
        },
        {
          id: "right",
          type: "toggle",
          label: "Right",
          icon: <AlignRight />,
          execute: () => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          },
          isActive: selectionState.alignment === "right",
        },
        {
          id: "justify",
          type: "toggle",
          label: "Justify",
          icon: <AlignJustify />,
          execute: () => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
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
          execute: () => {
            // toggle bold via Lexical FORMAT_TEXT_COMMAND
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          },
          isActive: selectionState.format.bold,
        },
        {
          id: "italic",
          label: "Italic",
          icon: <Italic />,
          type: "toggle",
          execute: () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          },
          isActive: selectionState.format.italic,
        },
        {
          id: "underline",
          label: "Underline",
          icon: <Underline />,
          type: "toggle",
          execute: () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          },
          isActive: selectionState.format.underline,
        },
        {
          id: "strikethrough",
          label: "Strikethrough",
          icon: <Strikethrough />,
          type: "toggle",
          execute: () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          },
          isActive: selectionState.format.strikethrough,
        },
      ],
    };
    // TODO: we should make the value as type to help with types
    const textLevel: DropdownTool = {
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
      execute: (value) => {
        editor.update(() => {
          const selection = $getSelection();
          if (value === "paragraph") {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () =>
              $createHeadingNode(value as HeadingTagType)
            );
          }
        });
      },
    };

    const colorPickerTool: ValueTool = {
      id: "color-picker",
      label: "Color Picker",
      type: "value",
      value: selectionState.textColor,
      execute: (value) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!selection) return;
          $patchStyleText(selection, { color: value });
        });
      },
    };

    return [
      textLevel as Tool,
      formatingTextTools,
      alignmentsTool,
      colorPickerTool,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectionState.alignment,
    selectionState.format,
    selectionState.level,
    selectionState.textColor,
  ]);

  return (
    <FloatingToolbar>
      <Toolbar tools={tools} />
    </FloatingToolbar>
  );
});

FloatingToolbarPlugin.displayName = "FloatingToolbarPlugin";

export default FloatingToolbarPlugin;
