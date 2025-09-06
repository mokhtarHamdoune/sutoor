// TODO: see if we need the type of the tool
import { LexicalEditor } from "lexical";
export type ToolType = "toggle" | "dropdown" | "custom";

export interface Tool {
  id: string;
  type: ToolType;
  label?: string;
  icon?: React.ReactNode;
  /** perform action when clicked/activated */
  execute: (editor: LexicalEditor) => void;
  /** optional: whether this tool active given the current editor state */
  isActive?: (editor: LexicalEditor) => boolean;
  /** optional: custom render if we need custom UI for the tool */
  render?: (props: { editor: LexicalEditor }) => React.ReactNode;
}
