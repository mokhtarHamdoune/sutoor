/**
 * InsertImageListener
 *
 * A Lexical editor plugin that listens for the SHOW_INSERT_IMAGE_DIALOG_COMMAND
 * and displays a popover above the current cursor position.
 *
 * Features:
 * - Listens for SHOW_INSERT_IMAGE_DIALOG_COMMAND
 * - Shows popover above the current line/cursor
 * - Handles inserting the image at the cursor position
 * - Manages popover visibility (show/hide)
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { createPortal } from "react-dom";
import InsertImagePopover from "./insert-image-popover";
import {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
  SHOW_INSERT_IMAGE_DIALOG_COMMAND,
} from "./index";

export const InsertImageListener = () => {
  const [editor] = useLexicalComposerContext();
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  /**
   * Listen for SHOW_INSERT_IMAGE_DIALOG_COMMAND
   * When triggered, get cursor position and show popover above it
   */
  useEffect(() => {
    return editor.registerCommand(
      SHOW_INSERT_IMAGE_DIALOG_COMMAND,
      () => {
        editor.focus();
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const anchorNode = anchor.getNode();
            const element = anchorNode.getTopLevelElementOrThrow();

            // Get the DOM element for positioning
            const domElement = editor.getElementByKey(element.getKey());
            if (domElement) {
              const rect = domElement.getBoundingClientRect();
              // Position popover above the current line
              setPopoverPosition({
                top: rect.top,
                left: rect.left,
              });
            }
          }
        });
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  /**
   * Handle image insertion
   * Dispatches INSERT_IMAGE_COMMAND and closes popover
   */
  const handleInsertImage = (payload: InsertImagePayload) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    setPopoverPosition(null);
  };

  /**
   * Close popover
   */
  const handleClose = () => {
    setPopoverPosition(null);
  };

  // Don't render if popover is not open
  if (!popoverPosition) {
    return null;
  }

  return createPortal(
    <InsertImagePopover
      position={popoverPosition}
      onInsert={handleInsertImage}
      onClose={handleClose}
    />,
    document.body
  );
};

export default InsertImageListener;
