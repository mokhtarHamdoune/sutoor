/**
 * DividerPlugin
 *
 * Adds the ability to insert horizontal dividers (horizontal rules) into the editor.
 *
 * Features:
 * - Registers "/divider" slash command
 * - Listens for INSERT_DIVIDER_COMMAND
 * - Inserts HorizontalRuleNode at cursor position
 */

import type { JSX } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import { Minus } from "lucide-react";

import {
  $createHorizontalRuleNode,
  HorizontalRuleNode,
} from "../../nodes/HorizontalRuleNode";
import { useCommandRegistry } from "../../hooks";

// Command to insert a divider - can be dispatched from anywhere
export const INSERT_DIVIDER_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_DIVIDER_COMMAND",
);

export function DividerPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const { registerCommand } = useCommandRegistry();

  useEffect(() => {
    // Ensure the node is registered
    if (!editor.hasNodes([HorizontalRuleNode])) {
      throw new Error(
        "DividerPlugin: HorizontalRuleNode not registered on editor",
      );
    }

    // Register the slash command (shows in command palette when user types "/")
    const cleanup = registerCommand({
      id: "insert_divider_command",
      label: "Divider",
      keywords: ["divider", "hr", "horizontal", "line", "separator"],
      category: "basic",
      description: "Insert a horizontal divider line",
      icon: <Minus size={18} />,
      execute(editor) {
        editor.dispatchCommand(INSERT_DIVIDER_COMMAND, undefined);
      },
    });

    // Listen for the INSERT_DIVIDER_COMMAND and insert the node
    const unregisterCommand = editor.registerCommand<void>(
      INSERT_DIVIDER_COMMAND,
      () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          // Get the current block element (paragraph containing "/")
          const anchorNode = selection.anchor.getNode();
          const topLevelElement = anchorNode.getTopLevelElementOrThrow();

          // Create the divider node
          const dividerNode = $createHorizontalRuleNode();

          // Create a new paragraph for the cursor to land in after the divider
          const newParagraph = $createParagraphNode();

          // Replace the current paragraph (with "/") with the divider
          topLevelElement.replace(dividerNode);

          // Insert a paragraph after the divider so user can continue typing
          dividerNode.insertAfter(newParagraph);

          // Move selection to the new paragraph
          newParagraph.select();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );

    return () => {
      cleanup();
      unregisterCommand();
    };
  }, [editor, registerCommand]);

  return null;
}

export default DividerPlugin;
