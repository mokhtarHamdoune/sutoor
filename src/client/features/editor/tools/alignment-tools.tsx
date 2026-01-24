import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import type { ToggleTool, ToggleGroupTools } from "../interfaces/tool";
import type { ToolFactoryContext } from "./types";

/**
 * Creates a Left alignment tool
 */
export const createAlignLeftTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "align-left",
  label: "Align Left",
  icon: <AlignLeft />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  },
  isActive: selectionState.alignment === "left",
});

/**
 * Creates a Center alignment tool
 */
export const createAlignCenterTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "align-center",
  label: "Align Center",
  icon: <AlignCenter />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
  },
  isActive: selectionState.alignment === "center",
});

/**
 * Creates a Right alignment tool
 */
export const createAlignRightTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "align-right",
  label: "Align Right",
  icon: <AlignRight />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  },
  isActive: selectionState.alignment === "right",
});

/**
 * Creates a Justify alignment tool
 */
export const createAlignJustifyTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "align-justify",
  label: "Justify",
  icon: <AlignJustify />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
  },
  isActive: selectionState.alignment === "justify",
});

/**
 * Creates a toggle group containing all alignment tools.
 * Includes: Left, Center, Right, Justify
 */
export const createAlignmentToolGroup = (
  context: ToolFactoryContext
): ToggleGroupTools => ({
  id: "alignments",
  label: "Alignments",
  type: "toggle-group",
  tools: [
    createAlignLeftTool(context),
    createAlignCenterTool(context),
    createAlignRightTool(context),
    createAlignJustifyTool(context),
  ],
});
