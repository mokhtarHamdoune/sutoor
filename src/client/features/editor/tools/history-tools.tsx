import { useEffect, useState, useMemo } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { Undo, Redo } from "lucide-react";
import { mergeRegister } from "@lexical/utils";
import type { ToggleTool, ToggleGroupTools } from "../interfaces/tool";

export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Hook to track undo/redo availability in the Lexical editor.
 * Returns the current history state (canUndo, canRedo).
 */
export function useHistoryState(): HistoryState {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor]);

  return { canUndo, canRedo };
}

export interface HistoryToolFactoryContext {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  historyState: HistoryState;
}

/**
 * Creates an Undo tool
 */
export const createUndoTool = ({
  editor,
  historyState,
}: HistoryToolFactoryContext): ToggleTool => ({
  id: "undo",
  type: "toggle",
  label: "Undo",
  icon: <Undo size={18} />,
  execute: () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  },
  isActive: false,
  disabled: !historyState.canUndo,
});

/**
 * Creates a Redo tool
 */
export const createRedoTool = ({
  editor,
  historyState,
}: HistoryToolFactoryContext): ToggleTool => ({
  id: "redo",
  type: "toggle",
  label: "Redo",
  icon: <Redo size={18} />,
  execute: () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
  isActive: false,
  disabled: !historyState.canRedo,
});

/**
 * Creates a toggle group containing undo/redo tools.
 */
export const createHistoryToolGroup = (
  context: HistoryToolFactoryContext
): ToggleGroupTools => ({
  id: "history",
  label: "History",
  type: "toggle-group",
  tools: [createUndoTool(context), createRedoTool(context)],
});

/**
 * Hook that returns memoized history tools.
 * Convenience hook that combines useHistoryState with tool factories.
 */
export function useHistoryTools(): ToggleTool[] {
  const [editor] = useLexicalComposerContext();
  const historyState = useHistoryState();

  return useMemo(
    () => [
      createUndoTool({ editor, historyState }),
      createRedoTool({ editor, historyState }),
    ],
    [editor, historyState]
  );
}
