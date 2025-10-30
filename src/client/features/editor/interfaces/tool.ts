// TODO: see if we need the type of the tool
import { LexicalEditor } from "lexical";
export type ToolType =
  | "toggle"
  | "toggle-group"
  | "dropdown"
  | "custom"
  | "value";

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
  execute: () => void;
}

export interface ToggleGroupTools extends BaseTool {
  type: "toggle-group";
  tools: ToggleTool[];
}

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface DropdownTool extends BaseTool {
  type: "dropdown";
  items: DropdownItem[];
  /** current value */
  value?: string;
  /** perform action when an item is selected */
  execute: (value: string) => void;
}

export interface CustomTool extends BaseTool {
  type: "custom";
  /** perform action when the tool is activated */
  execute: (editor: LexicalEditor) => void;
  /** custom render function */
  render: () => React.ReactNode;
}

export interface ValueTool extends BaseTool {
  type: "value";
  /** current value (e.g., selected color) */
  value: string;
  /** perform action when value changes */
  execute: (value: string) => void;
}

export type Tool =
  | ToggleTool
  | ToggleGroupTools
  | DropdownTool
  | CustomTool
  | ValueTool;
