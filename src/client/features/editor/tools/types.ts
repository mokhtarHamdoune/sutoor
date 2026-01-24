import type { LexicalEditor } from "lexical";
import type { SelectionState } from "@/client/features/editor/utils/selection-checkers";

/**
 * Context passed to tool factory functions.
 * Contains everything a tool needs to create itself.
 */
export interface ToolFactoryContext {
  editor: LexicalEditor;
  selectionState: SelectionState;
}
