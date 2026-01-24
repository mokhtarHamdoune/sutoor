import { $getSelection, $createParagraphNode } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { List, ListOrdered } from "lucide-react";
import type { ToggleTool, ToggleGroupTools } from "../interfaces/tool";
import type { ToolFactoryContext } from "./types";

/**
 * Creates a Bullet List tool
 */
export const createBulletListTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "bullet-list",
  label: "Bullet List",
  icon: <List />,
  type: "toggle",
  execute: () => {
    if (
      selectionState.element?.type === "list" &&
      selectionState.element.listType === "bullet"
    ) {
      // If already in a bullet list, toggle off to paragraph
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
});

/**
 * Creates a Numbered List tool
 */
export const createNumberedListTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "numbered-list",
  label: "Numbered List",
  icon: <ListOrdered />,
  type: "toggle",
  execute: () => {
    if (
      selectionState.element?.type === "list" &&
      selectionState.element.listType === "number"
    ) {
      // If already in a numbered list, toggle off to paragraph
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
});

/**
 * Creates a toggle group containing list tools.
 * Includes: Bullet List, Numbered List
 */
export const createListToolGroup = (
  context: ToolFactoryContext
): ToggleGroupTools => ({
  id: "lists",
  label: "Lists",
  type: "toggle-group",
  tools: [createBulletListTool(context), createNumberedListTool(context)],
});
