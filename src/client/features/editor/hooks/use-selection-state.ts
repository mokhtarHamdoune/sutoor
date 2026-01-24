import { useEffect, useState, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import {
  handleSelectionUpdate,
  type SelectionState,
  DEFAULT_SELECTION_STATE,
} from "@/client/features/editor/utils/selection-checkers";

/**
 * Hook to track the current selection state in the Lexical editor.
 * Provides reactive updates for text formatting, alignment, block type,
 * colors, and link state.
 *
 * @returns The current selection state
 */
export function useSelectionState(): SelectionState {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = useState<SelectionState>(
    DEFAULT_SELECTION_STATE
  );

  const isSelectionStateEqual = useCallback(
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

  return selectionState;
}

export default useSelectionState;
