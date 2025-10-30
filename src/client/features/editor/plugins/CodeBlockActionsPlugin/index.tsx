/**
 * CodeBlockActionsPlugin
 *
 * A Lexical editor plugin that provides an action menu for code blocks.
 *
 * Features:
 * - Automatically detects when the cursor is inside a code block
 * - Shows a floating action menu positioned at the top-right of the code block
 * - Allows users to change the programming language for syntax highlighting
 * - Provides a copy-to-clipboard button for the code content
 *
 * The plugin monitors editor selection changes and updates the menu position
 * and language state accordingly. The menu is only visible when the cursor
 * is within a code block.
 *
 * @example
 * ```tsx
 * <LexicalComposer>
 *   <CodeBlockActionsPlugin />
 * </LexicalComposer>
 * ```
 */

import { $createCodeNode, $isCodeNode, CodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $addUpdateTag,
  $getSelection,
  $isRangeSelection,
  SKIP_SELECTION_FOCUS_TAG,
} from "lexical";

import { $setBlocksType } from "@lexical/selection";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CodeActionMenu } from "./code-action-menu";
import { DEFAULT_CODE_LANGUAGE } from "./languages";
import { useCommandRegistry } from "../../hooks";
import { Code } from "lucide-react";

/**
 * Helper function to get the current code node from selection.
 * Returns null if selection is not within a code block.
 */
function getCodeNodeFromSelection(): CodeNode | null {
  const selection = $getSelection();
  if (!selection || !$isRangeSelection(selection)) {
    return null;
  }

  const anchorNode = selection.anchor.getNode();
  const element = anchorNode.getTopLevelElement();

  return $isCodeNode(element) ? element : null;
}

export const CodeBlockActionsPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [codeBlockPosition, setCodeBlockPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    DEFAULT_CODE_LANGUAGE
  );
  const { registerCommand } = useCommandRegistry();

  useEffect(() => {
    // ✅ Register image command
    const cleanup = registerCommand({
      id: "code-block-command",
      label: "Code Block",
      description: "Change block to a code block",
      keywords: ["code block", "/code block", "code", "/code"],
      icon: <Code />,
      category: "basic",
      execute(editor) {
        editor.update(() => {
          $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
          const selection = $getSelection();
          // Create code block with JavaScript as default language for testing
          $setBlocksType(selection, () => $createCodeNode("javascript"));
        });
      },
    });

    return cleanup; // Cleanup when plugin unmounts
  }, [registerCommand]);

  /**
   * Monitor editor updates to detect when cursor enters/exits code blocks.
   * Updates the action menu position and language state accordingly.
   */
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const codeNode = getCodeNodeFromSelection();

        if (codeNode) {
          // Cursor is in a code block - show the action menu
          const domElement = editor.getElementByKey(codeNode.getKey());
          if (domElement) {
            const rect = domElement.getBoundingClientRect();
            setCodeBlockPosition({
              top: rect.top,
              left: rect.left,
              width: rect.width,
            });
            setCurrentLanguage(codeNode.getLanguage() || DEFAULT_CODE_LANGUAGE);
          }
        } else {
          // Cursor is not in a code block - hide the menu
          setCodeBlockPosition(null);
        }
      });
    });
  }, [editor]);

  /**
   * Handle language change from the dropdown selector.
   * Updates the code node's language property for syntax highlighting.
   */
  const handleLanguageChange = (language: string) => {
    editor.update(() => {
      const codeNode = getCodeNodeFromSelection();
      if (codeNode) {
        codeNode.setLanguage(language);
        setCurrentLanguage(language);
      }
    });
  };

  /**
   * Copy code block content to clipboard.
   * Extracts text content from the current code node and shows a toast notification.
   */
  const handleCopy = () => {
    editor.getEditorState().read(() => {
      const codeNode = getCodeNodeFromSelection();
      if (codeNode) {
        const codeContent = codeNode.getTextContent();
        navigator.clipboard
          .writeText(codeContent)
          .then(() => {
            toast.success("Code copied to clipboard");
          })
          .catch((error) => {
            console.error("Failed to copy code to clipboard:", error);
            toast.error("Failed to copy code");
          });
      }
    });
  };

  // Don't render anything if cursor is not in a code block
  if (!codeBlockPosition) {
    return null;
  }

  return (
    <CodeActionMenu
      language={currentLanguage}
      position={codeBlockPosition}
      onLanguageChange={handleLanguageChange}
      onCopy={handleCopy}
    />
  );
};

export default CodeBlockActionsPlugin;
