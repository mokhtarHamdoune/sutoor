import {
  $isRangeSelection,
  BaseSelection,
  RangeSelection,
  type LexicalNode,
} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode } from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { $isCodeNode } from "@lexical/code";

type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

type TextAlignment = "left" | "center" | "right" | "justify";

export type TextLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "paragraph";

interface ParagraphElement {
  type: "paragraph";
}
interface ListElement {
  type: "list";
  // Possible values: "bullet" for bulleted lists, "number" for numbered lists
  listType: "bullet" | "number";
}

interface HeadingElement {
  type: "heading";
  tag: TextLevel;
}

interface CodeElement {
  type: "code";
}

type EditorElement = HeadingElement | ListElement | ParagraphElement | CodeElement;

export type SelectionState = {
  format: TextFormat;
  alignment: TextAlignment;
  textColor: string; // optional, for future use
  element: ParagraphElement | ListElement | HeadingElement | CodeElement | null;
  isLinkActive: boolean;
  linkUrl: string | null; // Add the actual link URL
};

export const DEFAULT_SELECTION_STATE: SelectionState = {
  format: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  alignment: "left",
  textColor: "#000000",
  element: null,
  isLinkActive: false,
  linkUrl: null,
};

const getTextFormat = (selection: RangeSelection): TextFormat => {
  return {
    bold: selection.hasFormat("bold"),
    italic: selection.hasFormat("italic"),
    underline: selection.hasFormat("underline"),
    strikethrough: selection.hasFormat("strikethrough"),
  };
};

const getTextAlignment = (selection: RangeSelection): TextAlignment => {
  const selectionNodes = selection.getNodes();
  if (selectionNodes.length > 0) {
    const firstNode = selectionNodes[0];
    const parent = firstNode.getParent();
    if (parent) {
      return (parent.getFormatType() as TextAlignment) || "left";
    }
    return "left";
  }
  return "left";
};

/**
 * Get the text color for the current selection.
 * Extracts hex color from selection style, defaults to black.
 *
 * @param selection - The current range selection
 * @returns The hex color value of the selected text
 */
const getTextColor = (selection: RangeSelection): string => {
  // For now, return the default color
  // TODO: Implement proper color extraction when we have color styling in place
  const selectionStyle = selection.style;
  const colorMatch = selectionStyle.match(/color:\s*(#[0-9a-fA-F]{6})/);
  if (colorMatch && colorMatch?.length > 1 && colorMatch[1]) {
    return colorMatch[1];
  }
  return "#000000";
};

const getElement = (selection: RangeSelection): EditorElement | null => {
  const nodes = selection.getNodes();
  if (!nodes || nodes.length === 0) return null;

  const firstNode = nodes[0];
  const elementNode = firstNode.getTopLevelElement();
  if ($isHeadingNode(elementNode)) {
    return { type: "heading", tag: elementNode.getTag() as TextLevel };
  } else if ($isListNode(elementNode)) {
    const listType = elementNode.getListType();
    if (listType === "bullet" || listType === "number") {
      return { type: "list", listType: listType };
    }
  } else if ($isCodeNode(elementNode)) {
    return { type: "code" };
  } else {
    return { type: "paragraph" };
  }
  return null;
};

// Walk up to find the nearest LinkNode (checking self first).
// Why not just getParent()? Because:
// - The current node can be the LinkNode itself (parent would skip it).
// - There can be inline wrappers between text and the LinkNode.
// - Walking ancestors is shallow and avoids false negatives.
export const getNearestLinkAncestor = (node: LexicalNode | null) => {
  let cur: LexicalNode | null = node;
  while (cur) {
    if ($isLinkNode(cur)) return cur;
    cur = cur.getParent();
  }
  return null;
};

// Determine if the selection is inside a link.
// - Collapsed (caret or cursor): active if caret is anywhere inside a LinkNode.
// - Range: active only if both ends are within the same LinkNode.
//   We compare node keys because instances can differ across reads,
//   while keys are stable identifiers for the same node.
export const isLinkSelection = (selection: RangeSelection) => {
  if (selection.isCollapsed()) {
    return !!getNearestLinkAncestor(selection.anchor.getNode());
  }
  const anchorLink = getNearestLinkAncestor(selection.anchor.getNode());
  const focusLink = getNearestLinkAncestor(selection.focus.getNode());
  return (
    !!anchorLink && !!focusLink && anchorLink.getKey() === focusLink.getKey()
  );
};

// Get the URL of the link in the current selection
export const getLinkUrl = (selection: RangeSelection): string | null => {
  const linkNode = getNearestLinkAncestor(selection.anchor.getNode());
  return linkNode ? linkNode.getURL() : null;
};

/**
 * Central selection state handler that extracts comprehensive formatting information.
 * Analyzes the current selection and returns formatting state including:
 * - Text formatting (bold, italic, underline, strikethrough)
 * - Text alignment (left, center, right, justify)
 * - Text level/heading (h1-h6 or paragraph)
 * - Text color (extracted from inline styles, defaults to black)
 *
 * @param selection - The current base selection from the editor
 * @returns SelectionState object containing all formatting information
 */
export function handleSelectionUpdate(
  selection: BaseSelection
): SelectionState {
  if ($isRangeSelection(selection)) {
    const format = getTextFormat(selection);
    const alignment = getTextAlignment(selection);
    const textColor = getTextColor(selection);
    const element = getElement(selection);
    const isLinkActive = isLinkSelection(selection);
    const linkUrl = getLinkUrl(selection);
    return { format, alignment, textColor, element, isLinkActive, linkUrl };
  }
  return DEFAULT_SELECTION_STATE;
}

export const getSelectionCoordinates = () => {
  const domSelection = document.getSelection();
  // If there's no DOM selection, clear coordinates to hide toolbar
  if (!domSelection || domSelection?.rangeCount === 0) {
    return null;
  }
  const range = domSelection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  return {
    top: Math.floor(rect.top),
    left: Math.floor(rect.left),
  };
};
