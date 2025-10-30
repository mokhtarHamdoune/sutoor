import React, { memo, useEffect, useMemo } from "react";
import FloatingToolbar from "@/client/features/editor/components/floating-toolbar";
import Toolbar from "@/client/features/editor/components/toolbar/toolbar";
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
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
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
  ListOrdered,
  List,
  Link,
  Code,
} from "lucide-react";
import {
  handleSelectionUpdate,
  type SelectionState,
  DEFAULT_SELECTION_STATE,
} from "@/client/features/editor/utils/selection-checkers";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { SHOW_FLOATING_LINK_INPUT_COMMAND } from "./FloatingLinkPlugin/command";
import { getSelectionCoordinates } from "../utils/selection-checkers";
import { $createCodeNode } from "@lexical/code";

export const FloatingToolbarPlugin: React.FC = memo(() => {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = React.useState<SelectionState>(
    DEFAULT_SELECTION_STATE
  );

  const isSelectionStateEqual = React.useCallback(
    (a: SelectionState, b: SelectionState) => {
      return (
        a.alignment === b.alignment &&
        JSON.stringify(a.element) === JSON.stringify(b.element) &&
        a.textColor === b.textColor &&
        JSON.stringify(a.format) === JSON.stringify(b.format) &&
        a.isLinkActive === b.isLinkActive &&
        a.linkUrl === b.linkUrl
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
        {
          id: "code",
          label: "Code",
          icon: <Code />,
          type: "toggle",
          execute: () => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          },
          isActive: selectionState.format.code,
        },
      ],
    };
    // TODO: we should make the value as type to help with types
    const textLevel: DropdownTool = {
      id: "text-level",
      label: "Block Type",
      type: "dropdown",
      items: [
        {
          label: "Paragraph",
          value: "paragraph",
        },
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
          label: "Code Block",
          value: "code",
        },
        {
          label: "Quote",
          value: "quote",
        },
      ],
      value:
        selectionState.element?.type === "heading"
          ? selectionState.element.tag
          : selectionState.element?.type === "code"
          ? "code"
          : selectionState.element?.type === "quote"
          ? "quote"
          : "paragraph",
      execute: (value) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!selection) {
            return;
          }

          if (value === "paragraph") {
            $setBlocksType(selection, () => $createParagraphNode());
          } else if (value === "code") {
            // Create code block with JavaScript as default language for testing
            $setBlocksType(selection, () => $createCodeNode("javascript"));
          } else if (value === "quote") {
            $setBlocksType(selection, () => $createQuoteNode());
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

    // TODO:  dispatch and isactive for list tools
    const listGroupTools: ToggleGroupTools = {
      id: "list",
      label: "Lists",
      type: "toggle-group",
      tools: [
        {
          id: "bullet-list",
          label: "Bullet List",
          icon: <List />,
          type: "toggle",
          execute: () => {
            if (
              selectionState.element?.type === "list" &&
              selectionState.element.listType === "bullet"
            ) {
              // If already in a list, toggle off to paragraph
              editor.update(() => {
                const selection = $getSelection();
                if (selection) {
                  $setBlocksType(selection, () => $createParagraphNode());
                }
              });
              return;
            }
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          },
          isActive:
            selectionState.element?.type === "list" &&
            selectionState.element.listType === "bullet",
        },
        {
          id: "numbered-list",
          label: "Numbered List",
          icon: <ListOrdered />,
          type: "toggle",
          execute: () => {
            if (
              selectionState.element?.type === "list" &&
              selectionState.element.listType === "number"
            ) {
              // If already in a list, toggle off to paragraph
              editor.update(() => {
                const selection = $getSelection();
                if (selection) {
                  $setBlocksType(selection, () => $createParagraphNode());
                }
              });
              return;
            }
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          },
          isActive:
            selectionState.element?.type === "list" &&
            selectionState.element.listType === "number",
        },
        {
          id: "link",
          label: "Link",
          icon: <Link />,
          type: "toggle",
          execute: () => {
            if (selectionState.isLinkActive) {
              // Remove existing link
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            } else {
              // Show floating link input for new links
              const coordinates = getSelectionCoordinates();
              editor.dispatchCommand(SHOW_FLOATING_LINK_INPUT_COMMAND, {
                url: selectionState.linkUrl || "",
                coordinates: coordinates || undefined,
              });
            }
          },
          isActive: selectionState.isLinkActive,
        },
      ],
    };

    return [
      textLevel as Tool,
      formatingTextTools,
      alignmentsTool,
      listGroupTools,
      colorPickerTool,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectionState.alignment,
    selectionState.format,
    selectionState.element,
    selectionState.textColor,
    selectionState.isLinkActive,
    selectionState.linkUrl,
  ]);
  //   export const formatCode = (editor: LexicalEditor, blockType: string) => {
  //   if (blockType !== 'code') {
  //
  //   }
  // };

  return (
    <FloatingToolbar>
      <Toolbar tools={tools} />
    </FloatingToolbar>
  );
});

FloatingToolbarPlugin.displayName = "FloatingToolbarPlugin";

export default FloatingToolbarPlugin;
