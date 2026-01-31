import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  LexicalNode,
} from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import CommandPanel from "./command-panel";
import { useCommandRegistry } from "../../hooks";

/**
 * CommandPlugin
 *
 * Detects when a user types "/" (slash) character in the editor and displays
 * a command panel with registered commands. The panel appears when "/" is typed
 * at the beginning of a line or after a space.
 *
 * Features:
 * - Automatic detection of "/" trigger character
 * - Positioning of command panel above the current line
 * - Cleanup of "/" character when panel is closed
 * - Integration with command registry system
 */

// Regex patterns for detecting slash command triggers
const SLASH_AT_START = /^\//; // Matches "/" at the beginning of text
const SLASH_AFTER_SPACE = /\s+\//; // Matches "/" preceded by whitespace

export const CommandPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { commands } = useCommandRegistry();

  // Memoize regex test function to avoid recreating on each render
  const shouldShowPanel = useMemo(
    () => (text: string) =>
      SLASH_AT_START.test(text) || SLASH_AFTER_SPACE.test(text),
    [],
  );

  /**
   * Calculate and set the position for the command panel based on the current cursor position
   */
  const calculatePanelPosition = useCallback(
    (anchorNode: LexicalNode) => {
      const element = anchorNode.getTopLevelElementOrThrow();
      const domElement = editor.getElementByKey(element.getKey());

      if (domElement) {
        const rect = domElement.getBoundingClientRect();
        setPanelPosition({
          top: rect.top,
          left: rect.left,
        });
      }
    },
    [editor],
  );

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const text = anchorNode.getTextContent();

          // Show panel if "/" is detected and panel is not already visible
          if (shouldShowPanel(text)) {
            if (!panelPosition) {
              calculatePanelPosition(anchorNode);
            }
          }
        }
      });
    });
  }, [editor, panelPosition, shouldShowPanel, calculatePanelPosition]);

  /**
   * Closes the command panel and removes the "/" trigger character from the editor.
   *
   * Handles two cases:
   * 1. "/" at the start: "/text" -> "text"
   * 2. "/" after space: "hello /text" -> "hello text"
   */
  const onClosePanel = useCallback(() => {
    setPanelPosition(null);

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();

        // Check if the node is still in the document and has a valid parent
        const parent = anchorNode.getParent();
        if (!parent) {
          return; // Node was removed or is at root level, skip cleanup
        }

        const text = anchorNode.getTextContent();

        let newText = text;

        // Check if slash is after a space
        if (SLASH_AFTER_SPACE.test(text)) {
          const slashIndex = text.search(SLASH_AFTER_SPACE);
          // Remove the "/" that comes after the space
          newText =
            text.substring(0, slashIndex) +
            text.substring(slashIndex).replace("/", "");
        }
        // Check if slash is at the start
        else if (SLASH_AT_START.test(text)) {
          // Remove the leading "/"
          newText = text.substring(1);
        }

        // Only replace if text actually changed and we have valid text
        if (newText !== text) {
          const newTextNode = $createTextNode(newText);
          anchorNode.replace(newTextNode);
        }
      }
    });
  }, [editor]);

  if (!panelPosition) {
    return null;
  }

  return (
    <CommandPanel
      position={panelPosition}
      onClose={onClosePanel}
      commands={commands}
      editor={editor}
    />
  );
};

export default CommandPlugin;
