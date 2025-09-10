// TODO: see if we need the type of the tool
import { LexicalEditor } from "lexical";
export type ToolType = "toggle" | "toggle-group" | "dropdown" | "custom";

export interface BaseTool {
  id: string;
  type: ToolType;
  label?: string;
  icon?: React.ReactNode;
}

export interface ToggleTool extends BaseTool {
  type: "toggle";
  /** optional: whether this tool active given the current editor state */
  isActive: boolean;
  /** perform action when clicked/activated */
  execute: (editor: LexicalEditor) => void;
}

export interface ToggleGroupTools extends BaseTool {
  type: "toggle-group";
  tools: ToggleTool[];
}

export interface DropdownItem<T extends string | number> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface DropdownTool<T extends string | number> extends BaseTool {
  type: "dropdown";
  items: DropdownItem<T>[];
  /** current value */
  value?: T;
  /** perform action when an item is selected */
  execute: (editor: LexicalEditor, value: T) => void;
  /** optional: whether this tool active given the current editor state */
  isActive: boolean;
}

export interface CustomTool extends BaseTool {
  type: "custom";
  /** perform action when the tool is activated */
  execute: (editor: LexicalEditor) => void;
  /** custom render function */
  render: (props: { editor: LexicalEditor }) => React.ReactNode;
}

export type Tool =
  | ToggleTool
  | ToggleGroupTools
  | DropdownTool<string | number>
  | CustomTool;
