import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, RangeSelection } from "lexical";
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

type SelectionConfig = {
  countCollapseAsSelection: boolean;
};

export type Position = {
  top: number;
  left: number;
};

export const useSelectionCoord = (
  config: SelectionConfig = { countCollapseAsSelection: false }
) => {
  const [coordinates, setCoordinates] = useState<Position | null>(null);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const getCoordinates = (selection: RangeSelection) => {
      // const domSelection = document.getSelection();
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();

      // Get the DOM element for positioning
      const domElement = editor.getElementByKey(element.getKey());
      // If there's no DOM selection, clear coordinates to hide toolbar
      if (!domElement) {
        setCoordinates(null);
        return;
      }

      const rect = domElement.getBoundingClientRect();
      // When tracking is disabled, keep previous coordinates stable (no movement)
      setCoordinates({
        top: Math.floor(rect.top),
        left: Math.floor(rect.left),
      });
    };
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          // Always clear coordinates on invalid selection so the toolbar hides,
          // regardless of tracking state
          setCoordinates(null);
          return;
        }

        if (selection.isCollapsed() && !config.countCollapseAsSelection) {
          setCoordinates(null);
          return;
        }

        getCoordinates(selection);
      });
    });

    return () => {
      unregister();
    };
  }, [editor, config.countCollapseAsSelection]);

  return {
    coordinates,
  };
};

export default useSelectionCoord;
