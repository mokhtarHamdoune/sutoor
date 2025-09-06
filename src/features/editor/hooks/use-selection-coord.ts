import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useRef, useState } from "react";
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
  const allowTrack = useRef<boolean>(true);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const getCoordinates = () => {
      if (!allowTrack.current) {
        setCoordinates((prev) => prev);
        return;
      }
      const domSelection = document.getSelection();
      if (!domSelection || domSelection?.rangeCount === 0) {
        setCoordinates(null);
        return;
      }
      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setCoordinates({
        top: Math.floor(rect.top),
        left: Math.floor(rect.left),
      });
    };
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setCoordinates(null);
          return;
        }
        getCoordinates();
      });
    });
  }, [editor]);

  const allowTracking = () => {
    allowTrack.current = true;
  };
  const disableTracking = () => {
    allowTrack.current = false;
  };

  return {
    coordinates,
    allowTracking,
    disableTracking,
  };
};

export default useSelectionCoord;
