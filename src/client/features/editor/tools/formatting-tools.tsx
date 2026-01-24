import { FORMAT_TEXT_COMMAND } from "lexical";
import { Bold, Italic, Underline, Strikethrough, Code } from "lucide-react";
import type { ToggleTool, ToggleGroupTools } from "../interfaces/tool";
import type { ToolFactoryContext } from "./types";

/**
 * Creates a Bold formatting tool
 */
export const createBoldTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "bold",
  label: "Bold",
  icon: <Bold />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  },
  isActive: selectionState.format.bold,
});

/**
 * Creates an Italic formatting tool
 */
export const createItalicTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "italic",
  label: "Italic",
  icon: <Italic />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  },
  isActive: selectionState.format.italic,
});

/**
 * Creates an Underline formatting tool
 */
export const createUnderlineTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "underline",
  label: "Underline",
  icon: <Underline />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  },
  isActive: selectionState.format.underline,
});

/**
 * Creates a Strikethrough formatting tool
 */
export const createStrikethroughTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "strikethrough",
  label: "Strikethrough",
  icon: <Strikethrough />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  },
  isActive: selectionState.format.strikethrough,
});

/**
 * Creates an inline Code formatting tool
 */
export const createInlineCodeTool = ({
  editor,
  selectionState,
}: ToolFactoryContext): ToggleTool => ({
  id: "code",
  label: "Code",
  icon: <Code />,
  type: "toggle",
  execute: () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  },
  isActive: selectionState.format.code,
});

/**
 * Creates a toggle group containing all text formatting tools.
 * Includes: Bold, Italic, Underline, Strikethrough, Code
 */
export const createFormattingToolGroup = (
  context: ToolFactoryContext
): ToggleGroupTools => ({
  id: "formatting",
  label: "Text Formatting",
  type: "toggle-group",
  tools: [
    createBoldTool(context),
    createItalicTool(context),
    createUnderlineTool(context),
    createStrikethroughTool(context),
    createInlineCodeTool(context),
  ],
});
