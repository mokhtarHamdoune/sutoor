import { $getSelection, $createParagraphNode, LexicalEditor } from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createCodeNode } from "@lexical/code";
import type { DropdownTool, DropdownItem } from "../interfaces/tool";
import type { ToolFactoryContext } from "./types";
import type { SelectionState } from "../utils/selection-checkers";

/**
 * Block type options available in the dropdown
 */
export const BLOCK_TYPE_ITEMS: DropdownItem[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Code Block", value: "code" },
  { label: "Quote", value: "quote" },
];

/**
 * Determines the current block type value based on selection state
 */
export const getBlockTypeValue = (selectionState: SelectionState): string => {
  if (selectionState.element?.type === "heading") {
    return selectionState.element.tag;
  }
  if (selectionState.element?.type === "code") {
    return "code";
  }
  if (selectionState.element?.type === "quote") {
    return "quote";
  }
  return "paragraph";
};

/**
 * Executes the block type change in the editor
 */
export const executeBlockTypeChange = (
  editor: LexicalEditor,
  value: string
): void => {
  editor.update(() => {
    const selection = $getSelection();
    if (!selection) {
      return;
    }

    if (value === "paragraph") {
      $setBlocksType(selection, () => $createParagraphNode());
    } else if (value === "code") {
      // Create code block with JavaScript as default language
      $setBlocksType(selection, () => $createCodeNode("javascript"));
    } else if (value === "quote") {
      $setBlocksType(selection, () => $createQuoteNode());
    } else {
      // Headings: h1, h2, h3, etc.
      $setBlocksType(selection, () =>
        $createHeadingNode(value as HeadingTagType)
      );
    }
  });
};

/**
 * Creates a Block Type dropdown tool.
 * Allows switching between paragraph, headings (h1-h3), code block, and quote.
 */
export const createBlockTypeTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): DropdownTool => ({
  id: "block-type",
  label: "Block Type",
  type: "dropdown",
  items: BLOCK_TYPE_ITEMS,
  value: getBlockTypeValue(selectionState),
  execute: (value) => executeBlockTypeChange(editor, value),
});
