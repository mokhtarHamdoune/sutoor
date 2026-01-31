/**
 * HorizontalRuleNode
 *
 * A custom Lexical node that renders a horizontal divider line (<hr>).
 * This is a "decorator" node - meaning it renders custom React components
 * instead of plain DOM elements.
 *
 * Key concepts:
 * - DecoratorBlockNode: Base class for block-level nodes with custom rendering
 * - exportDOM: How the node converts to HTML for saving/copying
 * - importDOM: How HTML converts back to this node when pasting
 * - decorate: Returns the React component to render
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
} from "lexical";
import type { JSX } from "react";

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useCallback, useEffect } from "react";

// ============================================
// Component: HorizontalRuleComponent
// ============================================
// This is the React component that renders the divider visually

type HorizontalRuleComponentProps = {
  nodeKey: NodeKey;
};

function HorizontalRuleComponent({ nodeKey }: HorizontalRuleComponentProps) {
  const [editor] = useLexicalComposerContext();

  // useLexicalNodeSelection: Hook to manage if this node is "selected"
  // Returns: [isSelected, setSelected, clearSelection]
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  // Handle deletion when node is selected and user presses delete/backspace
  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey],
  );

  useEffect(() => {
    // Register commands for selection and deletion
    return mergeRegister(
      // Handle click to select the divider
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          const hrElement = editor.getElementByKey(nodeKey);
          if (event.target === hrElement) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(true);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      // Handle backspace to delete
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      // Handle delete key
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, nodeKey, clearSelection, setSelected, onDelete]);

  return (
    <div className="w-full py-2" data-lexical-decorator="true">
      <hr
      // className={`w-full border-0 h-0.5 cursor-pointer ${
      //   isSelected ? "bg-blue-500 ring-2 ring-blue-200" : "bg-gray-200"
      // }`}
      />
    </div>
  );
}

// ============================================
// Serialization Type
// ============================================
// Defines the JSON structure when saving/loading the node

export type SerializedHorizontalRuleNode = SerializedDecoratorBlockNode;

// ============================================
// DOM Conversion Helper
// ============================================
// Called when importing HTML (e.g., pasting)

function $convertHorizontalRuleElement(): DOMConversionOutput {
  return { node: $createHorizontalRuleNode() };
}

// ============================================
// HorizontalRuleNode Class
// ============================================

export class HorizontalRuleNode extends DecoratorBlockNode {
  /**
   * getType: Returns a unique string identifier for this node type.
   * Lexical uses this to distinguish between different node types.
   */
  static getType(): string {
    return "horizontal-rule";
  }

  /**
   * clone: Creates a copy of this node.
   * Required by Lexical for immutability.
   */
  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__format, node.__key);
  }

  /**
   * importJSON: Recreates the node from serialized JSON data.
   * Called when loading saved content.
   */
  static importJSON(
    serializedNode: SerializedHorizontalRuleNode,
  ): HorizontalRuleNode {
    return $createHorizontalRuleNode().updateFromJSON(serializedNode);
  }

  /**
   * exportJSON: Converts the node to JSON for saving.
   */
  exportJSON(): SerializedHorizontalRuleNode {
    return {
      ...super.exportJSON(),
    };
  }

  /**
   * exportDOM: Converts the node to HTML DOM.
   * Used when copying content or exporting to HTML.
   */
  exportDOM(): DOMExportOutput {
    return { element: document.createElement("hr") };
  }

  /**
   * importDOM: Defines how to convert HTML elements back to this node.
   * The key is the HTML tag name (lowercase), value is a conversion config.
   */
  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: $convertHorizontalRuleElement,
        priority: 0,
      }),
    };
  }

  /**
   * updateDOM: Returns whether the DOM needs to be recreated.
   * For simple nodes like this, we always return false (no update needed).
   */
  updateDOM(): false {
    return false;
  }

  /**
   * decorate: Returns the React component to render.
   * This is where DecoratorBlockNode nodes define their visual output.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return <HorizontalRuleComponent nodeKey={this.__key} />;
  }
}

// ============================================
// Helper Functions (Convention: $-prefixed)
// ============================================

/**
 * Creates a new HorizontalRuleNode instance.
 * The $ prefix is a Lexical convention for functions that
 * should be called inside editor.update() or editor.read().
 */
export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return new HorizontalRuleNode();
}

/**
 * Type guard to check if a node is a HorizontalRuleNode.
 */
export function $isHorizontalRuleNode(
  node: LexicalNode | null | undefined,
): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode;
}
