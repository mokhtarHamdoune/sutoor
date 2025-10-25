import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useState } from "react";
/**
 * Calculates the coordinates for positioning the toolbar menu.
 * The menu is positioned centered above the selected text (cursor).
 * If no text is selected or the selection range is invalid, the coordinates are set to null.
 *
 * The calculation considers:
 * - The bounding rectangle of the selected text range.
 * - The dimensions of the toolbar menu (retrieved from `toolbareRef`).
 * - A vertical offset of 10 pixels above the selection.
 *
 */
export const useSelectionCoord = () => {
  const [coordinates, setCoordinates] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const getCoordinates = () => {
      const domSelection = document.getSelection();
      // If there's no DOM selection, clear coordinates to hide toolbar
      if (!domSelection || domSelection?.rangeCount === 0) {
        setCoordinates(null);
        return;
      }
      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // When tracking is disabled, keep previous coordinates stable (no movement)
      setCoordinates({
        top: Math.floor(rect.top),
        left: Math.floor(rect.left),
      });
    };
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          // Always clear coordinates on invalid selection so the toolbar hides,
          // regardless of tracking state
          setCoordinates(null);
          return;
        }
        getCoordinates();
      });
    });

    return () => {
      unregister();
    };
  }, [editor]);

  return {
    coordinates,
  };
};

export default useSelectionCoord;
